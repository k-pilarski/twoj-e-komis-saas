import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <section id="kontakt" className="py-24 px-8 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-primary mb-6">Zaczynamy?</h2>
      <p className="text-on-surface-variant mb-8">
        Dostęp do platformy przyznajemy indywidualnie. Wypełnij prosty formularz lub skontaktuj się z nami telefonicznie, a przygotujemy konto w 24 godziny.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/register" className="px-8 py-4 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">assignment</span>
          Wypełnij formularz zgłoszeniowy
        </Link>
      </div>
      <div className="mt-8 flex justify-center gap-8 text-on-surface-variant font-medium">
        <span className="flex items-center gap-2"><span className="material-symbols-outlined">call</span> +48 123 456 789</span>
        <span className="flex items-center gap-2"><span className="material-symbols-outlined">mail</span> kontakt@twoj-ekomis.pl</span>
      </div>
    </section>
  );
}