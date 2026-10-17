// client/src/pages/Storefront.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPublicStorefront } from '../services/publicService';
import { calculateHorsepower } from '../utils/vehicleValidators';

export default function Storefront() {
  const { slug } = useParams();
  const [storefront, setStorefront] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('INVENTORY'); // INVENTORY | CONTACT | REGULATIONS
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const loadStorefront = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPublicStorefront(slug);
        setStorefront(data);
        setActiveTab('INVENTORY');
      } catch (err) {
        setError(err.message || 'Nie udało się załadować wizytówki komisu.');
      } finally {
        setIsLoading(false);
      }
    };
    loadStorefront();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-600 gap-3">
        <span className="material-symbols-outlined animate-spin text-4xl">autorenew</span>
        <span className="font-medium">Ładowanie oferty komisu...</span>
      </div>
    );
  }

  if (error || !storefront) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md shadow-sm">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-3">storefront</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wizytówka niedostępna</h1>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Wróć na stronę główną Twój e-Komis
          </Link>
        </div>
      </div>
    );
  }

  const { dealerName, settings, vehicles } = storefront;
  const themeColor = settings.primaryColor || '#2563eb';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Górny pasek nawigacyjny komisu */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: themeColor }}
            >
              <span className="material-symbols-outlined">directions_car</span>
            </div>
            <div className="truncate">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 truncate">{dealerName}</h1>
              {settings.address && (
                <p className="text-xs text-gray-500 truncate">{settings.address}</p>
              )}
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('INVENTORY')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'INVENTORY' ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === 'INVENTORY' ? { backgroundColor: themeColor } : {}}
            >
              Oferta ({vehicles.length})
            </button>

            {settings.hasContactPage && (
              <button
                type="button"
                onClick={() => setActiveTab('CONTACT')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'CONTACT' ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === 'CONTACT' ? { backgroundColor: themeColor } : {}}
              >
                Kontakt
              </button>
            )}

            {settings.hasRegulationsPage && (
              <button
                type="button"
                onClick={() => setActiveTab('REGULATIONS')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'REGULATIONS' ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === 'REGULATIONS' ? { backgroundColor: themeColor } : {}}
              >
                Regulamin
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Baner powitalny */}
      <section
        className="text-white py-12 px-4 sm:px-6"
        style={{ backgroundColor: themeColor }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">{dealerName}</h2>
            <p className="text-white/90 text-sm sm:text-base max-w-xl">
              Sprawdzone samochody używane. Zapraszamy do zapoznania się z naszą aktualną ofertą pojazdów dostępnych od ręki.
            </p>
          </div>
          {settings.phoneNumber && (
            <a
              href={`tel:${settings.phoneNumber}`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-100 transition-colors self-start sm:self-auto shrink-0"
            >
              <span className="material-symbols-outlined" style={{ color: themeColor }}>call</span>
              {settings.phoneNumber}
            </a>
          )}
        </div>
      </section>

      {/* Główna zawartość zależna od wybranej zakładki */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {activeTab === 'INVENTORY' && (
          <>
            {vehicles.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">garage</span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Brak pojazdów w ofercie</h3>
                <p className="text-gray-500 text-sm">Aktualnie przygotowujemy nowe ogłoszenia. Zapraszamy wkrótce!</p>
              </div>
            ) : (
              <>
                {/* UKŁAD 1: SIATKA (GRID) */}
                {settings.layoutType === 'GRID' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400 relative">
                            <span className="material-symbols-outlined text-6xl">directions_car</span>
                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
                              {v.year}
                            </span>
                            {v.isDamaged && (
                              <span className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                                Uszkodzony
                              </span>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {v.brand} {v.model}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                              {v.mileage !== null && <span>{Number(v.mileage).toLocaleString('pl-PL')} km</span>}
                              {v.fuelType && <span>• {v.fuelType}</span>}
                              {v.transmission && <span>• {v.transmission}</span>}
                            </div>
                            {v.description && (
                              <p className="text-xs text-gray-600 mt-3 line-clamp-2 break-all">{v.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xl font-extrabold" style={{ color: themeColor }}>
                            {Number(v.price).toLocaleString('pl-PL')} PLN
                          </span>
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            Szczegóły <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* UKŁAD 2: LISTA (LIST) */}
                {settings.layoutType === 'LIST' && (
                  <div className="flex flex-col gap-4">
                    {vehicles.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-5 min-w-0 flex-1">
                          <div className="w-28 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                            <span className="material-symbols-outlined text-4xl">directions_car</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {v.brand} {v.model}
                              </h3>
                              <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded">
                                {v.year}
                              </span>
                              {v.isDamaged && (
                                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                  Uszkodzony
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600 mt-2">
                              {v.mileage !== null && <span>Przebieg: <strong>{Number(v.mileage).toLocaleString('pl-PL')} km</strong></span>}
                              {v.fuelType && <span>Paliwo: <strong>{v.fuelType}</strong></span>}
                              {v.transmission && <span>Skrzynia: <strong>{v.transmission}</strong></span>}
                              {v.enginePower && (
                                <span>Moc: <strong>{v.enginePower} kW ({calculateHorsepower(v.enginePower)} KM)</strong></span>
                              )}
                            </div>

                            {v.description && (
                              <p className="text-xs text-gray-500 mt-2 line-clamp-1 break-all">{v.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                          <span className="text-2xl font-extrabold" style={{ color: themeColor }}>
                            {Number(v.price).toLocaleString('pl-PL')} PLN
                          </span>
                          <span
                            className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                            style={{ backgroundColor: themeColor }}
                          >
                            Zobacz ofertę
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* UKŁAD 3: MINIMALISTYCZNY (MINIMAL) */}
                {settings.layoutType === 'MINIMAL' && (
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-200">
                    {vehicles.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className="p-4 sm:px-6 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {v.year}
                          </span>
                          <h3 className="font-bold text-gray-900 truncate">
                            {v.brand} {v.model}
                          </h3>
                          {v.fuelType && <span className="text-xs text-gray-500 hidden md:inline">• {v.fuelType}</span>}
                          {v.mileage !== null && (
                            <span className="text-xs text-gray-500 hidden sm:inline">
                              • {Number(v.mileage).toLocaleString('pl-PL')} km
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                          <span className="font-extrabold text-lg" style={{ color: themeColor }}>
                            {Number(v.price).toLocaleString('pl-PL')} PLN
                          </span>
                          <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* PODSTRONA: KONTAKT */}
        {activeTab === 'CONTACT' && settings.hasContactPage && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontakt z komisem</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  <span className="material-symbols-outlined">store</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Nazwa firmy</p>
                  <p className="text-base font-bold text-gray-900">{dealerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Telefon kontaktowy</p>
                  <p className="text-base font-bold text-gray-900">
                    {settings.phoneNumber || 'Nie podano numeru telefonu'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Adres placu</p>
                  <p className="text-base font-bold text-gray-900">
                    {settings.address || 'Nie podano adresu stacjonarnego'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PODSTRONA: REGULAMIN */}
        {activeTab === 'REGULATIONS' && settings.hasRegulationsPage && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-3xl mx-auto shadow-sm prose prose-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Regulamin wizytówki komisu {dealerName}</h3>
            <div className="text-gray-600 space-y-4 text-sm leading-relaxed">
              <p>
                1. Niniejsza strona internetowa ma charakter wyłącznie informacyjny, a prezentowane ogłoszenia nie stanowią oferty w rozumieniu art. 66 § 1 Kodeksu Cywilnego.
              </p>
              <p>
                2. Sprzedający ({dealerName}) dokłada wszelkich starań, aby opisy oraz parametry techniczne pojazdów były aktualne i rzetelne, jednak zaleca się weryfikację stanu pojazdu bezpośrednio na placu komisu przed dokonaniem zakupu.
              </p>
              <p>
                3. W celu umówienia oględzin lub jazdy próbnej prosimy o wcześniejszy kontakt telefoniczny pod numerem wskazanym w zakładce Kontakt.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Modal ze szczegółami wybranego pojazdu */}
      {selectedVehicle && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedVehicle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Rocznik {selectedVehicle.year}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
              <span className="text-sm font-medium text-gray-600">Cena brutto:</span>
              <span className="text-2xl font-extrabold" style={{ color: themeColor }}>
                {Number(selectedVehicle.price).toLocaleString('pl-PL')} PLN
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
              {selectedVehicle.mileage !== null && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Przebieg</span>
                  <strong className="text-gray-900">{Number(selectedVehicle.mileage).toLocaleString('pl-PL')} km</strong>
                </div>
              )}
              {selectedVehicle.fuelType && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Paliwo</span>
                  <strong className="text-gray-900">{selectedVehicle.fuelType}</strong>
                </div>
              )}
              {selectedVehicle.transmission && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Skrzynia biegów</span>
                  <strong className="text-gray-900">{selectedVehicle.transmission}</strong>
                </div>
              )}
              {selectedVehicle.engineCapacity && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Pojemność</span>
                  <strong className="text-gray-900">{selectedVehicle.engineCapacity} cm³</strong>
                </div>
              )}
              {selectedVehicle.enginePower && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Moc silnika</span>
                  <strong className="text-gray-900">
                    {selectedVehicle.enginePower} kW ({calculateHorsepower(selectedVehicle.enginePower)} KM)
                  </strong>
                </div>
              )}
              {selectedVehicle.bodyType && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Nadwozie</span>
                  <strong className="text-gray-900">{selectedVehicle.bodyType}</strong>
                </div>
              )}
              {selectedVehicle.drivetrain && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Napęd</span>
                  <strong className="text-gray-900">{selectedVehicle.drivetrain}</strong>
                </div>
              )}
              {selectedVehicle.color && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Kolor</span>
                  <strong className="text-gray-900">{selectedVehicle.color}</strong>
                </div>
              )}
              {selectedVehicle.vin && (
                <div className="bg-gray-50 p-3 rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-xs text-gray-500 block">Numer VIN</span>
                  <strong className="text-gray-900 font-mono text-xs">{selectedVehicle.vin}</strong>
                </div>
              )}
              {selectedVehicle.isImported && selectedVehicle.importedFrom && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 block">Kraj pochodzenia</span>
                  <strong className="text-gray-900">{selectedVehicle.importedFrom}</strong>
                </div>
              )}
            </div>

            {selectedVehicle.description && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Opis pojazdu</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line break-words bg-gray-50 p-4 rounded-xl">
                  {selectedVehicle.description}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {settings.phoneNumber && (
                <a
                  href={`tel:${settings.phoneNumber}`}
                  className="px-5 py-2.5 rounded-lg font-bold text-white flex items-center gap-2"
                  style={{ backgroundColor: themeColor }}
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Zadzwoń: {settings.phoneNumber}
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="px-5 py-2.5 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stopka */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-500 mt-auto">
        © {new Date().getFullYear()} {dealerName} • Strona wygenerowana w systemie <strong>Twój e-Komis</strong>
      </footer>
    </div>
  );
}