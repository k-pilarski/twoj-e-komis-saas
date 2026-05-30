import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const location = useLocation();

  const pageTitles = {
    '/dashboard': 'Pulpit',
    '/dashboard/builder': 'Kreator Strony',
    '/dashboard/inventory': 'Zarządzanie Inwentarzem',
    '/dashboard/documents': 'Generator Dokumentów',
    '/dashboard/settings': 'Ustawienia Konta',
  };

  const currentTitle = pageTitles[location.pathname] || 'Panel';

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-surface-container-high flex items-center justify-between px-8 z-10">
      <h2 className="text-xl font-bold text-primary">
        {currentTitle}
      </h2>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
          U
        </div>
      </div>
    </header>
  );
}