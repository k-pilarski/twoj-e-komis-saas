import { useVehicleForm } from '../hooks/useVehicleForm';
import FormHeader from '../components/inventory/FormHeader';
import InputField from '../components/ui/InputField';
import TextAreaField from '../components/ui/TextAreaField';

export default function VehicleForm() {
  const { formData, error, isSubmitting, handleChange, handleSubmit } = useVehicleForm();

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <FormHeader 
        title="Dodaj nowy pojazd" 
        description="Uzupełnij podstawowe dane samochodu." 
        backUrl="/dashboard/inventory" 
      />

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-8 shadow-sm">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Marka *" 
              id="brand" 
              name="brand" 
              required 
              value={formData.brand} 
              onChange={handleChange} 
              placeholder="np. Toyota"
            />
            <InputField 
              label="Model *" 
              id="model" 
              name="model" 
              required 
              value={formData.model} 
              onChange={handleChange} 
              placeholder="np. Corolla"
            />
            <InputField 
              label="Rocznik *" 
              id="year" 
              name="year" 
              type="number"
              required 
              min="1900" 
              max={new Date().getFullYear() + 1}
              value={formData.year} 
              onChange={handleChange} 
              placeholder="np. 2018"
            />
            <InputField 
              label="Cena (PLN) *" 
              id="price" 
              name="price" 
              type="number"
              required 
              min="0"
              step="0.01"
              value={formData.price} 
              onChange={handleChange} 
              placeholder="np. 45000"
            />
          </div>

          <TextAreaField 
            label="Krótki opis" 
            id="description" 
            name="description" 
            rows="4" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Dodatkowe informacje o pojeździe..."
          />

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">autorenew</span>
                  Zapisywanie...
                </>
              ) : (
                'Zapisz pojazd'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}