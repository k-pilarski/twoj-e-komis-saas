import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { name: 'Pulpit', path: '/dashboard', icon: 'dashboard' },
    { name: 'Kreator Strony', path: '/dashboard/builder', icon: 'web' },
    { name: 'Inwentarz', path: '/dashboard/inventory', icon: 'directions_car' },
    { name: 'Dokumenty', path: '/dashboard/documents', icon: 'description' },
    { name: 'Ustawienia', path: '/dashboard/settings', icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-surface-container-high flex flex-col hidden md:flex">
      <div className="h-20 flex items-center gap-2 px-6 border-b border-surface-container-high">
        <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
        <span className="font-headline-md text-xl font-bold text-primary tracking-tight">Twój E-Komis</span>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md transition-all ${
                isActive 
                  ? 'bg-secondary-container text-on-secondary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-container-high">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Wyloguj się</span>
        </button>
      </div>
    </aside>
  );
}