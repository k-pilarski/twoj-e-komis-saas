export default function Pricing() {
  return (
    <section id="cennik" className="py-20 px-8 bg-surface-container-lowest border-y border-surface-container-high">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Wybierz pakiet idealny dla Twojej floty</h2>
          <p className="text-on-surface-variant">Zacznij od niezobowiązującej rozmowy. Skonfigurujemy system pod Twoje potrzeby.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-outline-variant rounded-2xl p-8 flex flex-col hover:border-secondary transition-colors">
            <h3 className="text-xl font-bold text-primary mb-2">Basic</h3>
            <p className="text-on-surface-variant text-sm mb-6">Dla początkujących handlarzy.</p>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Do 20 pojazdów</span></li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Standardowy szablon strony</span></li>
            </ul>
            <a href="#kontakt" className="w-full text-center py-3 border border-outline-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors">Zapytaj o cenę</a>
          </div>

          <div className="border-2 border-secondary rounded-2xl p-8 flex flex-col bg-surface-container-low relative shadow-lg transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Najczęściej wybierany
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Premium</h3>
            <p className="text-on-surface-variant text-sm mb-6">Pełna automatyzacja dla średnich i dużych komisów.</p>
            <ul className="flex flex-col gap-3 mb-8 flex-1 font-medium">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Nielimitowana flota</span></li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Dedykowany kreator i domena</span></li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Generator umów i faktur</span></li>
            </ul>
            <a href="#kontakt" className="w-full text-center py-3 bg-secondary text-on-secondary rounded-lg font-label-md hover:bg-secondary-container transition-colors shadow-md">Umów wdrożenie</a>
          </div>

          <div className="border border-outline-variant rounded-2xl p-8 flex flex-col hover:border-secondary transition-colors">
            <h3 className="text-xl font-bold text-primary mb-2">Enterprise</h3>
            <p className="text-on-surface-variant text-sm mb-6">Rozwiązania szyte na miarę sieci komisów.</p>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Dedykowana infrastruktura</span></li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> <span>Wsparcie techniczne 24/7</span></li>
            </ul>
            <a href="#kontakt" className="w-full text-center py-3 border border-outline-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors">Skontaktuj się</a>
          </div>
        </div>
      </div>
    </section>
  );
}