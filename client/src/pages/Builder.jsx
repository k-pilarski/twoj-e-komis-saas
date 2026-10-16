import { useSettings } from '../hooks/useSettings';
import InputField from '../components/ui/InputField';
import CheckboxField from '../components/ui/CheckboxField';

const COLORS = [
  { label: 'Niebieski', value: '#2563eb', hex: 'bg-blue-600' },
  { label: 'Czerwony', value: '#dc2626', hex: 'bg-red-600' },
  { label: 'Zielony', value: '#16a34a', hex: 'bg-green-600' },
  { label: 'Pomarańczowy', value: '#ea580c', hex: 'bg-orange-600' },
  { label: 'Ciemny grafit', value: '#1f2937', hex: 'bg-gray-800' }
];

const LAYOUTS = [
  { id: 'GRID', label: 'Siatka (Grid)', icon: 'grid_view' },
  { id: 'LIST', label: 'Lista (List)', icon: 'view_list' },
  { id: 'MINIMAL', label: 'Minimalistyczny', icon: 'splitscreen' }
];

export default function Builder() {
  const { formData, isLoading, isSubmitting, error, successMsg, handleChange, handleDirectChange, handleSubmit } = useSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-3xl mr-3">autorenew</span>
        <span>Ładowanie kreatora...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Kreator Wizytówki</h1>
        <p className="text-on-surface-variant">Dostosuj wygląd i funkcjonalności strony publicznej swojego komisu.</p>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6 sm:p-8 shadow-sm">
        {error && <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm">{error}</div>}
        {successMsg && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-sm font-medium">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          {/* Wygląd - Kolor */}
          <div>
            <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">1. Motyw kolorystyczny</h3>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleDirectChange('primaryColor', color.value)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${color.hex} ${
                    formData.primaryColor === color.value ? 'ring-4 ring-offset-2 ring-primary scale-110' : 'hover:scale-105 opacity-80'
                  }`}
                  title={color.label}
                >
                  {formData.primaryColor === color.value && <span className="material-symbols-outlined text-white">check</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Wygląd - Układ */}
          <div>
            <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">2. Układ inwentarza</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => handleDirectChange('layoutType', layout.id)}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${
                    formData.layoutType === layout.id 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-surface-container-high text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl mb-2">{layout.icon}</span>
                  <span className="font-medium">{layout.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Konfiguracja podstron */}
          <div>
            <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">3. Moduły i podstrony</h3>
            <div className="flex flex-col gap-3">
              <CheckboxField label="Wyświetlaj podstronę Kontakt" id="hasContactPage" name="hasContactPage" checked={formData.hasContactPage} onChange={handleChange} />
              <CheckboxField label="Wyświetlaj podstronę Regulamin" id="hasRegulationsPage" name="hasRegulationsPage" checked={formData.hasRegulationsPage} onChange={handleChange} />
            </div>
          </div>

          {/* Dane kontaktowe */}
          <div>
            <h3 className="text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-4">4. Dane kontaktowe na wizytówce</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Numer telefonu" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="np. +48 123 456 789" />
              <InputField label="Adres komisu" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="np. ul. Główna 1, 00-001 Warszawa" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2">
              {isSubmitting ? <><span className="material-symbols-outlined animate-spin">autorenew</span> Zapisywanie...</> : 'Zapisz wygląd wizytówki'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}