import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Pricing from '../components/landing/Pricing';
import Contact from '../components/landing/Contact';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-background scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Pricing />
        <Contact />
      </main>
      <footer className="py-6 text-center text-sm text-on-surface-variant border-t border-surface-container-high">
        © 2026 Twój E-Komis. Wszelkie prawa zastrzeżone.
      </footer>
    </div>
  );
}