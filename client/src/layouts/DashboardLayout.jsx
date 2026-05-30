import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PendingBlockade from '../components/dashboard/PendingBlockade';
import { useUserData } from '../hooks/useUserData';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { userData, isLoading } = useUserData();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant gap-3">
        <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
        <span className="text-lg font-medium">Weryfikacja licencji...</span>
      </div>
    );
  }

  const accountStatus = userData?.userData?.status;
  const isPending = accountStatus === 'PENDING' || accountStatus === 'EXPIRED';

  return (
    <div className="min-h-screen bg-background flex font-body-md text-on-background">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-auto p-8 relative flex flex-col">
          {isPending ? (
            <PendingBlockade expiresAt={userData?.userData?.expiresAt} />
          ) : (
            <Outlet context={{ userData }} /> 
          )}
        </div>
      </main>
    </div>
  );
}