export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background font-body-md text-on-background">
      <main className="w-full lg:w-1/2 flex flex-col items-center justify-center relative overflow-hidden px-margin-mobile py-8">
        <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-surface-container-high rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-surface-container-high rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-md flex flex-col h-full justify-center">
          <header className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <span className="font-headline-md text-2xl font-bold text-primary tracking-tight">Twój E-Komis</span>
          </header>
          
          {children}
        </div>
      </main>

      <aside className="hidden lg:flex lg:w-1/2 bg-surface-container-low flex-col items-center justify-center p-12 relative border-l border-surface-container-high">
        <div className="max-w-lg text-center z-10">
          <h2 className="text-4xl font-bold text-on-surface mb-6 leading-tight">
            Efektywnie zarządzaj flotą swoich pojazdów
          </h2>
          <p className="text-lg text-on-surface-variant mb-12">
            Zyskaj pełną kontrolę nad swoim e-komisem dzięki zaawansowanym narzędziom analitycznym i intuicyjnemu panelowi sprzedawcy.
          </p>
          
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-4 border border-surface-container-high">
            <div className="flex gap-2 mb-4 border-b border-surface-container pb-4">
              <div className="w-1/3 h-4 bg-surface-container rounded-full"></div>
              <div className="grow"></div>
              <div className="w-6 h-6 bg-surface-container rounded-full"></div>
              <div className="w-6 h-6 bg-surface-container rounded-full"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-2/3 h-32 bg-surface-container-high rounded-lg opacity-50"></div>
              <div className="w-1/3 flex flex-col gap-2">
                <div className="h-14 bg-primary-fixed rounded-lg opacity-80"></div>
                <div className="h-16 bg-tertiary-fixed-dim rounded-lg opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}