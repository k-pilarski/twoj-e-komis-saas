export default function PendingBlockade({ expiresAt }) {
  const formattedDate = expiresAt 
    ? new Date(expiresAt).toLocaleDateString('pl-PL') 
    : 'Brak danych';

  return (
    <div className="flex-1 flex items-center justify-center p-8 h-full">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-lg border border-surface-container-high text-center relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-error"></div>
        
        <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        
        <h2 className="text-2xl font-bold text-primary mb-4">Konto nieaktywne</h2>
        <p className="text-on-surface-variant mb-6 leading-relaxed">
          Twój dostęp do narzędzi administracyjnych został tymczasowo zablokowany. Opłać fakturę abonamentową, aby odblokować pełen dostęp do platformy Twój E-Komis.
        </p>
        
        <div className="bg-surface-container-low p-4 rounded-lg mb-8 text-sm text-on-surface">
          <p className="font-medium">Twój okres próbny / ważność konta:</p>
          <p className="text-primary font-bold mt-1 text-lg">Do {formattedDate}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full py-3 bg-secondary text-on-secondary font-bold rounded-lg hover:bg-secondary-container transition-all shadow-md">
            Pobierz zaległą fakturę
          </button>
          <a href="mailto:kontakt@twoj-ekomis.pl" className="w-full py-3 border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container-low transition-all">
            Skontaktuj się z obsługą
          </a>
        </div>
      </div>
    </div>
  );
}