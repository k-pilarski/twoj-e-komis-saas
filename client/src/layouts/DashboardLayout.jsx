import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex font-body-md text-on-background">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-auto p-8 relative">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}