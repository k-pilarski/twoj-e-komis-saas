// client/src/components/inventory/VehicleListItem.jsx
export default function VehicleListItem({ vehicle, onDelete, onEdit, onPreview }) {
  return (
    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-lowest/50 transition-colors">
      
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-16 h-16 bg-surface-container-low rounded-lg flex items-center justify-center text-on-surface-variant shrink-0">
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-primary text-lg truncate max-w-full">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.isDamaged && (
              <span className="text-xs font-semibold bg-error-container text-on-error-container px-2 py-0.5 rounded">
                Uszkodzony
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant mt-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span> 
              {vehicle.year}
            </span>
            {vehicle.mileage !== null && vehicle.mileage !== undefined && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">speed</span>
                {Number(vehicle.mileage).toLocaleString('pl-PL')} km
              </span>
            )}
            {vehicle.fuelType && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">local_gas_station</span>
                {vehicle.fuelType}
              </span>
            )}
            <span className="flex items-center gap-1 font-medium text-secondary">
              <span className="material-symbols-outlined text-[16px]">payments</span> 
              {Number(vehicle.price).toLocaleString('pl-PL')} PLN
            </span>
          </div>

          {vehicle.description && (
            <p className="text-xs text-on-surface-variant/80 mt-1.5 line-clamp-1 break-all">
              {vehicle.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button 
          onClick={() => onPreview(vehicle)}
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors" 
          title="Podgląd"
        >
          <span className="material-symbols-outlined">visibility</span>
        </button>
        <button 
          onClick={() => onEdit(vehicle)}
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors" 
          title="Edytuj"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button 
          onClick={() => onDelete(vehicle.id)}
          className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors" 
          title="Usuń"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>

    </div>
  );
}