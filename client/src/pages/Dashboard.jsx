import { useOutletContext } from 'react-router-dom';
import { useVehicles } from '../hooks/useVehicles';

export default function Dashboard() {
  const { userData } = useOutletContext();
  const { vehicles, isLoading } = useVehicles();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-high mb-8">
        <h2 className="text-xl font-bold text-secondary mb-4">{userData?.message}</h2>
        <p className="mb-2 text-on-surface-variant">
          Twoje zakodowane ID: <span className="font-mono bg-surface-container px-2 py-1 rounded text-primary">{userData?.userData?.userId}</span>
        </p>
        <p className="mb-2 text-on-surface-variant">
          Przypisane ID komisu: <span className="font-mono bg-surface-container px-2 py-1 rounded text-primary">{userData?.userData?.tenantId}</span>
        </p>
        <p className="mb-2 text-on-surface-variant flex items-center gap-2">
          Status konta: 
          <span className="font-bold text-tertiary-container bg-tertiary-fixed-dim px-2 py-1 rounded text-xs tracking-wide">
            {userData?.userData?.status}
          </span>
        </p>
        <p className="mt-4 text-sm text-outline italic">{userData?.secretData}</p>
      </div>
      
      <h3 className="text-2xl font-bold text-primary mb-4">Statystyki Główne</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 bg-surface-container-lowest border border-surface-container-high rounded-xl flex flex-col justify-center relative overflow-hidden">
          <p className="text-on-surface-variant text-sm mb-1 z-10">Aktywne pojazdy</p>
          <p className="text-3xl font-bold text-primary z-10">
            {isLoading ? '...' : vehicles.length}
          </p>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-surface-container opacity-50 pointer-events-none">
            directions_car
          </span>
        </div>

        <div className="p-6 bg-surface-container-lowest border border-surface-container-high rounded-xl flex flex-col justify-center">
          <p className="text-on-surface-variant text-sm mb-1">Wygenerowane umowy</p>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="p-6 bg-surface-container-lowest border border-surface-container-high rounded-xl flex flex-col justify-center">
          <p className="text-on-surface-variant text-sm mb-1">Odwiedziny wizytówki</p>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
}