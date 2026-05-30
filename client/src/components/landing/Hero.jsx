export default function Hero() {
  return (
    <section id="oferta" className="py-24 px-8 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-surface-container-high rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-container-high rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
      
      <h1 className="text-5xl font-headline-xl text-primary leading-tight z-10">
        Zbuduj profesjonalną stronę swojego komisu w 5 minut
      </h1>
      <p className="text-lg text-on-surface-variant max-w-2xl z-10">
        Zyskaj pełną kontrolę nad sprzedażą. Dedykowany kreator stron, zarządzanie inwentarzem pojazdów i błyskawiczne generowanie dokumentów w jednym miejscu.
      </p>
      <div className="flex gap-4 mt-4 z-10">
        <a href="#cennik" className="px-6 py-3 font-label-md bg-secondary text-on-secondary rounded-lg hover:bg-secondary-container transition-all shadow-md">
          Sprawdź pakiety
        </a>
        <a href="#oferta" className="px-6 py-3 font-label-md border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-lg transition-all">
          Dowiedz się więcej
        </a>
      </div>
    </section>
  );
}