import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="h-20 bg-surface-container-lowest border-b border-surface-container-high flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
        <span className="font-headline-md text-xl font-bold text-primary tracking-tight">Twój E-Komis</span>
      </div>
      
      <nav className="hidden md:flex gap-8 font-label-md text-on-surface-variant">
        <a href="#oferta" className="hover:text-primary transition-colors">Oferta</a>
        <a href="#cennik" className="hover:text-primary transition-colors">Cennik</a>
        <a href="#kontakt" className="hover:text-primary transition-colors">Kontakt</a>
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/login" className="px-4 py-2 font-label-md text-secondary hover:bg-surface-container-low rounded-lg transition-colors">
          Zaloguj się
        </Link>
        <a href="#kontakt" className="hidden md:block px-5 py-2 font-label-md bg-secondary text-on-secondary rounded-lg hover:bg-secondary-container transition-all shadow-sm">
          Umów spotkanie
        </a>
      </div>
    </header>
  );
}