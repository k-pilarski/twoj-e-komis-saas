import { useVehicles } from '../hooks/useVehicles';
import VehicleListItem from '../components/inventory/VehicleListItem';
import EmptyState from '../components/ui/EmptyState';

export default function Inventory() {
  const { vehicles, isLoading, error, removeVehicle } = useVehicles();

  const handleDelete = async (id) => {
    try {
      await removeVehicle(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (vehicle) => {
    console.log('Edit clicked for:', vehicle);
  };

  const handlePreview = (vehicle) => {
    console.log('Preview clicked for:', vehicle);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-3xl mr-3">autorenew</span>
        <span>Ładowanie inwentarza...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary">Inwentarz Pojazdów</h2>
          <p className="text-on-surface-variant text-sm mt-1">Zarządzaj swoją flotą, cenami i dostępnością.</p>
        </div>
        <button 
          onClick={() => console.log('Add clicked')}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-medium hover:bg-secondary-container transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Dodaj pojazd
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden shadow-sm">
        {vehicles.length === 0 ? (
          <EmptyState 
            icon="directions_car" 
            title="Twój inwentarz jest pusty" 
            description='Kliknij "Dodaj pojazd", aby dodać pierwszy samochód do floty.' 
          />
        ) : (
          <div className="divide-y divide-surface-container-high">
            {vehicles.map((vehicle) => (
              <VehicleListItem 
                key={vehicle.id} 
                vehicle={vehicle} 
                onDelete={handleDelete}
                onEdit={handleEdit}
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}