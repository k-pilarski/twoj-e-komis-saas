import { useUserData } from '../hooks/useUserData';

export default function Dashboard() {
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin">autorenew</span>
        <span>Ładowanie tajnych danych...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-high">
        <h2 className="text-xl font-bold text-secondary mb-4">{userData?.message}</h2>
        <p className="mb-2 text-on-surface-variant">
          Twoje zakodowane ID: <span className="font-mono bg-surface-container px-2 py-1 rounded text-primary">{userData?.userData?.userId}</span>
        </p>
        <p className="mb-2 text-on-surface-variant">
          Przypisane ID komisu: <span className="font-mono bg-surface-container px-2 py-1 rounded text-primary">{userData?.userData?.tenantId}</span>
        </p>
        <p className="mt-4 text-sm text-outline italic">{userData?.secretData}</p>
      </div>
    </div>
  );
}