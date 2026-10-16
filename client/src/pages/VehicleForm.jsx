// client/src/pages/VehicleForm.jsx
import { useNavigate } from 'react-router-dom';
import { useVehicleForm } from '../hooks/useVehicleForm';
import FormHeader from '../components/inventory/FormHeader';
import InputField from '../components/ui/InputField';
import TextAreaField from '../components/ui/TextAreaField';
import SelectField from '../components/ui/SelectField';
import CheckboxField from '../components/ui/CheckboxField';
import { calculateHorsepower } from '../utils/vehicleValidators';

const FUEL_OPTIONS = [
  { value: 'Benzyna', label: 'Benzyna' }, { value: 'Diesel', label: 'Diesel' },
  { value: 'LPG', label: 'LPG' }, { value: 'Hybryda', label: 'Hybryda' }, { value: 'Elektryczny', label: 'Elektryczny' }
];
const TRANSMISSION_OPTIONS = [
  { value: 'Manualna', label: 'Manualna' }, { value: 'Automatyczna', label: 'Automatyczna' }
];
const DRIVETRAIN_OPTIONS = [
  { value: 'Na przednie koła', label: 'Na przednie koła' }, { value: 'Na tylne koła', label: 'Na tylne koła' }, { value: '4x4', label: '4x4 / AWD' }
];
const BODY_TYPE_OPTIONS = [
  { value: 'Sedan', label: 'Sedan' }, { value: 'Kombi', label: 'Kombi' }, { value: 'SUV', label: 'SUV / Terenowy' },
  { value: 'Hatchback', label: 'Hatchback' }, { value: 'Coupe', label: 'Coupe' }, { value: 'Minivan', label: 'Minivan' }
];

const SectionTitle = ({ children }) => (
  <h3 className="col-span-1 md:col-span-2 text-lg font-bold text-primary border-b border-surface-container-high pb-2 mb-2 mt-6">
    {children}
  </h3>
);

export default function VehicleForm() {
  const navigate = useNavigate();
  const {
    formData,
    error,
    isNotFound,
    isSubmitting,
    isLoading,
    isEditMode,
    handleChange,
    handleSubmit
  } = useVehicleForm();

  const currentYear = new Date().getFullYear();
  const todayDateString = new Date().toISOString().split('T')[0];
  const minRegistrationDate = formData.year && String(formData.year).length === 4 
    ? `${formData.year}-01-01` 
    : '1887-01-01';

  const calculatedHp = calculateHorsepower(formData.enginePower);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-3xl mr-3">autorenew</span>
        <span>Pobieranie danych pojazdu...</span>
      </div>
    );
  }

  // Blokada przy próbie edycji cudzego lub nieistniejącego pojazdu (Punkty 3.1 i 5.3)
  if (isNotFound) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-surface-container-lowest border border-surface-container-high rounded-xl p-8 text-center shadow-sm">
        <span className="material-symbols-outlined text-5xl text-error mb-3">gpp_bad</span>
        <h2 className="text-xl font-bold text-primary mb-2">Brak dostępu lub pojazd nie istnieje</h2>
        <p className="text-on-surface-variant text-sm mb-6">
          {error || 'Nie znaleziono szukanego pojazdu w Twoim inwentarzu.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/inventory')}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Wróć do inwentarza
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <FormHeader 
        title={isEditMode ? "Edytuj pojazd" : "Dodaj nowy pojazd"} 
        description="Uzupełnij szczegółowe dane, aby wygenerować profesjonalną ofertę w wizytówce." 
        backUrl="/dashboard/inventory" 
      />

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SEKCJA 1: Podstawowe */}
            <SectionTitle>1. Podstawowe informacje</SectionTitle>
            <InputField 
              label="Marka *" 
              id="brand" 
              name="brand" 
              required 
              maxLength={50}
              value={formData.brand} 
              onChange={handleChange} 
              placeholder="np. Alfa Romeo, BMW" 
            />
            <InputField 
              label="Model *" 
              id="model" 
              name="model" 
              required 
              maxLength={50}
              value={formData.model} 
              onChange={handleChange} 
              placeholder="np. Giulia, GT-R, XC90" 
            />
            <InputField 
              label="Rocznik *" 
              id="year" 
              name="year" 
              type="number" 
              integerOnly
              required 
              min="1887" 
              max={currentYear} 
              value={formData.year} 
              onChange={handleChange} 
              placeholder={`1887 - ${currentYear}`}
            />
            <InputField 
              label="Cena (PLN) *" 
              id="price" 
              name="price" 
              type="number" 
              required 
              min="100" 
              max="10000000" 
              step="0.01" 
              value={formData.price} 
              onChange={handleChange} 
              placeholder="100 - 10 000 000"
            />

            {/* SEKCJA 2: Identyfikacja i Historia */}
            <SectionTitle>2. Identyfikacja i Historia</SectionTitle>
            <InputField 
              label="Numer VIN" 
              id="vin" 
              name="vin" 
              minLength={17}
              maxLength={17}
              rightElement={`${formData.vin.length}/17`}
              value={formData.vin} 
              onChange={handleChange} 
              placeholder="17 znaków (bez I, O, Q)" 
            />
            <InputField 
              label="Numer rejestracyjny" 
              id="licensePlate" 
              name="licensePlate" 
              maxLength={8}
              rightElement={`${formData.licensePlate.length}/8`}
              value={formData.licensePlate} 
              onChange={handleChange} 
              placeholder="np. LU12345" 
            />
            <InputField 
              label="Data 1. rejestracji" 
              id="firstRegistration" 
              name="firstRegistration" 
              type="date" 
              min={minRegistrationDate}
              max={todayDateString}
              value={formData.firstRegistration} 
              onChange={handleChange} 
            />
            <InputField 
              label="Przebieg (km)" 
              id="mileage" 
              name="mileage" 
              type="number" 
              integerOnly
              min="0" 
              value={formData.mileage} 
              onChange={handleChange} 
              placeholder="np. 150000"
            />

            {/* SEKCJA 3: Stan i pochodzenie */}
            <SectionTitle>3. Stan i pochodzenie</SectionTitle>
            <CheckboxField 
              label="Pojazd jest uszkodzony" 
              id="isDamaged" 
              name="isDamaged" 
              checked={formData.isDamaged} 
              onChange={handleChange} 
            />
            <CheckboxField 
              label="Pojazd jest importowany" 
              id="isImported" 
              name="isImported" 
              checked={formData.isImported} 
              onChange={handleChange} 
            />
            
            {formData.isImported && (
              <div className="col-span-1 md:col-span-2 bg-surface-container-low p-4 rounded-lg">
                <InputField 
                  label="Kraj pochodzenia *" 
                  id="importedFrom" 
                  name="importedFrom" 
                  maxLength={60}
                  required={formData.isImported}
                  value={formData.importedFrom} 
                  onChange={handleChange} 
                  placeholder="np. Niemcy, Stany Zjednoczone, USA" 
                />
              </div>
            )}

            {/* SEKCJA 4: Specyfikacja techniczna */}
            <SectionTitle>4. Specyfikacja Techniczna</SectionTitle>
            <SelectField label="Rodzaj paliwa" id="fuelType" name="fuelType" options={FUEL_OPTIONS} value={formData.fuelType} onChange={handleChange} />
            <SelectField label="Typ nadwozia" id="bodyType" name="bodyType" options={BODY_TYPE_OPTIONS} value={formData.bodyType} onChange={handleChange} />
            <SelectField label="Skrzynia biegów" id="transmission" name="transmission" options={TRANSMISSION_OPTIONS} value={formData.transmission} onChange={handleChange} />
            <SelectField label="Napęd" id="drivetrain" name="drivetrain" options={DRIVETRAIN_OPTIONS} value={formData.drivetrain} onChange={handleChange} />
            <InputField 
              label="Pojemność skokowa (cm³)" 
              id="engineCapacity" 
              name="engineCapacity" 
              type="number" 
              integerOnly
              min="1" 
              value={formData.engineCapacity} 
              onChange={handleChange} 
              placeholder="np. 1995"
            />
            <InputField 
              label="Moc silnika (kW)" 
              id="enginePower" 
              name="enginePower" 
              type="number" 
              integerOnly
              min="1" 
              rightElement={calculatedHp ? `≈ ${calculatedHp} KM` : 'Przelicznik KM'}
              value={formData.enginePower} 
              onChange={handleChange} 
              placeholder="Podaj moc w kW (np. 110)"
            />
            <InputField 
              label="Kolor" 
              id="color" 
              name="color" 
              maxLength={40}
              value={formData.color} 
              onChange={handleChange} 
              placeholder="np. Czarny metalik" 
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Liczba drzwi" 
                id="doors" 
                name="doors" 
                type="number" 
                integerOnly
                min="1" 
                max="9" 
                value={formData.doors} 
                onChange={handleChange} 
                placeholder="1 - 9"
              />
              <InputField 
                label="Liczba miejsc" 
                id="seats" 
                name="seats" 
                type="number" 
                integerOnly
                min="1" 
                max="100" 
                value={formData.seats} 
                onChange={handleChange} 
                placeholder="1 - 100"
              />
            </div>

            {/* SEKCJA 5: Opis */}
            <SectionTitle>5. Dodatkowy Opis</SectionTitle>
            <div className="col-span-1 md:col-span-2">
              <TextAreaField 
                label="Opis pojazdu" 
                id="description" 
                name="description" 
                rows="5" 
                maxLength={5000}
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Napisz więcej o wyposażeniu i stanie technicznym..." 
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-surface-container-high">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 w-full md:w-auto justify-center"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">autorenew</span>
                  Zapisywanie...
                </>
              ) : (
                isEditMode ? 'Zapisz zmiany' : 'Dodaj pojazd do inwentarza'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}