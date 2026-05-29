import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/dashboard/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Sesja wygasła lub brak dostępu.');
        }

        const data = await response.json();
        setUserData(data);

      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProtectedData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background p-8">
      <div className="max-w-4xl mx-auto bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-container-high">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Panel E-Komisu</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-error-container text-on-error-container font-semibold rounded-lg hover:bg-[#ffb4ab] transition-colors"
          >
            Wyloguj się
          </button>
        </div>

        {userData ? (
          <div className="bg-surface p-6 rounded-lg border border-outline-variant">
            <h2 className="text-xl font-bold text-secondary mb-4">{userData.message}</h2>
            <p className="mb-2 text-on-surface-variant">
              Twoje zakodowane ID: <span className="font-mono bg-surface-container px-2 py-1 rounded text-primary">{userData.userData.userId}</span>
            </p>
            <p className="mb-2 text-on-surface-variant">
              Przypisane ID komisu (Tenant): <span className="font-mono bg-surface-container px-2 py-1 rounded text-primary">{userData.userData.tenantId}</span>
            </p>
            <p className="mt-4 text-sm text-outline italic">{userData.secretData}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">autorenew</span>
            <span>Ładowanie tajnych danych...</span>
          </div>
        )}
      </div>
    </div>
  );
}