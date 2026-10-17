// client/src/pages/Documents.jsx
import { Link } from 'react-router-dom';
import { useSaleAgreement } from '../hooks/useSaleAgreement';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import TextAreaField from '../components/ui/TextAreaField';
import { printOrDownloadAgreementPdf } from '../utils/printSaleAgreement';

const PAYMENT_OPTIONS = [
  { value: 'GOTÓWKA', label: 'Gotówka przy odbiorze' },
  { value: 'PRZELEW', label: 'Przelew bankowy' }
];

export default function Documents() {
  const {
    vehicles,
    isLoadingVehicles,
    formData,
    generatedAgreement,
    error,
    isSubmitting,
    handleVehicleSelect,
    handleChange,
    handleBuyerTypeChange,
    handleSubmit
  } = useSaleAgreement();

  const todayStr = new Date().toISOString().split('T')[0];

  if (isLoadingVehicles) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-3xl mr-3">autorenew</span>
        <span>Wczytywanie floty pojazdów...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Generator Dokumentów</h1>
        <p className="text-on-surface-variant">
          Wybierz pojazd z inwentarza, uzupełnij dane nabywcy i wygeneruj gotową do druku Umowę Kupna-Sprzedaży (PDF).
        </p>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">description</span>
          <h2 className="text-xl font-bold text-primary mb-2">Brak pojazdów w inwentarzu</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Aby wygenerować umowę kupna-sprzedaży, musisz najpierw dodać przynajmniej jeden samochód do swojego inwentarza.
          </p>
          <Link
            to="/dashboard/inventory/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Dodaj pierwszy pojazd
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEWA KOLUMNA: Formularz danych umowy */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-container-high rounded-xl p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              
              {/* 1. Wybór pojazdu */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">
                  1. Przedmiot sprzedaży
                </h3>
                <div className="flex flex-col gap-2">
                  <label htmlFor="vehicleId" className="text-sm font-medium text-on-surface">
                    Wybierz pojazd z inwentarza *
                  </label>
                  <select
                    id="vehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleVehicleSelect}
                    required
                    className="p-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">-- Wybierz samochód --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.year}) — {Number(v.price).toLocaleString('pl-PL')} PLN {v.vin ? `[VIN: ${v.vin}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Dane kupującego */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">
                  2. Dane kupującego
                </h3>

                {/* Przełącznik Osoba Prywatna / Firma */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => handleBuyerTypeChange('PRIVATE')}
                    className={`py-2.5 px-4 rounded-lg font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      formData.buyerType === 'PRIVATE'
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Osoba prywatna
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyerTypeChange('COMPANY')}
                    className={`py-2.5 px-4 rounded-lg font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      formData.buyerType === 'COMPANY'
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">business</span>
                    Firma (NIP)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <InputField
                      label={formData.buyerType === 'COMPANY' ? 'Pełna nazwa firmy *' : 'Imię i nazwisko kupującego *'}
                      id="buyerName"
                      name="buyerName"
                      value={formData.buyerName}
                      onChange={handleChange}
                      placeholder={formData.buyerType === 'COMPANY' ? 'np. Trans-Bud Sp. z o.o.' : 'np. Adam Nowak'}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <InputField
                      label="Adres zamieszkania / siedziby *"
                      id="buyerAddress"
                      name="buyerAddress"
                      value={formData.buyerAddress}
                      onChange={handleChange}
                      placeholder="np. ul. Słoneczna 12/4, 20-001 Lublin"
                      required
                    />
                  </div>

                  {formData.buyerType === 'PRIVATE' ? (
                    <>
                      <InputField
                        label="Numer PESEL *"
                        id="buyerPesel"
                        name="buyerPesel"
                        value={formData.buyerPesel}
                        onChange={handleChange}
                        rightElement={`${formData.buyerPesel.length}/11`}
                        placeholder="11 cyfr"
                        required
                      />
                      <InputField
                        label="Seria i nr dowodu / paszportu *"
                        id="buyerIdNumber"
                        name="buyerIdNumber"
                        value={formData.buyerIdNumber}
                        onChange={handleChange}
                        placeholder="np. ABC123456"
                        required
                      />
                    </>
                  ) : (
                    <div className="sm:col-span-2">
                      <InputField
                        label="Numer NIP *"
                        id="buyerNip"
                        name="buyerNip"
                        value={formData.buyerNip}
                        onChange={handleChange}
                        rightElement={`${formData.buyerNip.length}/10`}
                        placeholder="10 cyfr bez myślników"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Warunki transakcji */}
              <div>
                <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">
                  3. Warunki transakcji
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Kwota sprzedaży (PLN) *"
                    id="salePrice"
                    name="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={handleChange}
                    placeholder="np. 34900"
                    required
                  />
                  <SelectField
                    label="Forma płatności *"
                    id="paymentMethod"
                    name="paymentMethod"
                    options={PAYMENT_OPTIONS}
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Miejscowość zawarcia umowy *"
                    id="salePlace"
                    name="salePlace"
                    value={formData.salePlace}
                    onChange={handleChange}
                    placeholder="np. Lublin"
                    required
                  />
                  <InputField
                    label="Data zawarcia umowy *"
                    id="saleDate"
                    name="saleDate"
                    type="date"
                    max={todayStr}
                    value={formData.saleDate}
                    onChange={handleChange}
                    required
                  />
                  <div className="sm:col-span-2">
                    <TextAreaField
                      label="Dodatkowe ustalenia (opcjonalnie)"
                      id="additionalNotes"
                      name="additionalNotes"
                      rows="3"
                      maxLength={500}
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      placeholder="np. Kupujący otrzymuje komplet 2 kluczyków oraz dodatkowy komplet opon zimowych."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary py-3 px-6 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                    Weryfikacja i generowanie...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">contract</span>
                    Przygotuj umowę kupna-sprzedaży
                  </>
                )}
              </button>
            </form>
          </div>

          {/* PRAWA KOLUMNA: Podgląd wygenerowanej umowy i eksport do PDF */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-container-high rounded-xl p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4 flex items-center justify-between">
              <span>Podgląd dokumentu</span>
              {generatedAgreement && (
                <span className="text-xs font-mono bg-green-100 text-green-800 px-2.5 py-1 rounded">
                  Gotowa do druku
                </span>
              )}
            </h3>

            {!generatedAgreement ? (
              <div className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-3 opacity-50">picture_as_pdf</span>
                <p className="text-sm">
                  Wypełnij formularz po lewej stronie i kliknij <strong>„Przygotuj umowę”</strong>, aby wygenerować podgląd i pobrać gotowy plik PDF.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant text-xs space-y-2.5">
                  <div className="text-center border-b border-outline-variant pb-2 mb-2">
                    <p className="font-bold text-sm text-primary">UMOWA KUPNA-SPRZEDAŻY</p>
                    <p className="text-on-surface-variant font-mono">{generatedAgreement.contractNumber}</p>
                    <p className="text-on-surface-variant">
                      {generatedAgreement.salePlace}, dn. {generatedAgreement.saleDate} r.
                    </p>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block font-semibold">Sprzedający:</span>
                    <strong>{generatedAgreement.seller.dealerName}</strong> ({generatedAgreement.seller.ownerName})
                    <br />
                    {generatedAgreement.seller.address}
                  </div>

                  <div>
                    <span className="text-on-surface-variant block font-semibold">Kupujący:</span>
                    <strong>{generatedAgreement.buyer.name}</strong>
                    <br />
                    {generatedAgreement.buyer.address}
                    <br />
                    {generatedAgreement.buyer.type === 'PRIVATE'
                      ? `PESEL: ${generatedAgreement.buyer.pesel} | Dok: ${generatedAgreement.buyer.idNumber}`
                      : `NIP: ${generatedAgreement.buyer.nip}`}
                  </div>

                  <div className="border-t border-outline-variant pt-2">
                    <span className="text-on-surface-variant block font-semibold">Pojazd:</span>
                    <strong>
                      {generatedAgreement.vehicle.brand} {generatedAgreement.vehicle.model} ({generatedAgreement.vehicle.year})
                    </strong>
                    <br />
                    VIN: <span className="font-mono">{generatedAgreement.vehicle.vin}</span> | Rej: {generatedAgreement.vehicle.licensePlate}
                  </div>

                  <div className="border-t border-outline-variant pt-2 flex items-center justify-between">
                    <span className="font-semibold">Kwota ({generatedAgreement.paymentMethod}):</span>
                    <span className="text-base font-extrabold text-primary">
                      {Number(generatedAgreement.salePrice).toLocaleString('pl-PL')} PLN
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => printOrDownloadAgreementPdf(generatedAgreement)}
                  className="w-full bg-secondary text-on-secondary py-3.5 px-6 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined">print</span>
                  Pobierz PDF / Drukuj umowę (A4)
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}