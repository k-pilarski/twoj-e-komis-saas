import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useRegister } from '../hooks/useRegister';

export default function Register() {
  const { registerUser, error, setError, isLoading } = useRegister();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(formData);
  };

  return (
    <AuthLayout>
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Załóż konto</h1>
        <p className="text-on-surface-variant">Efektywnie zarządzaj flotą swoich pojazdów</p>
      </section>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error-container border border-[#ffb4ab] flex items-start gap-3">
          <span className="material-symbols-outlined text-on-error-container mt-0.5">error</span>
          <p className="text-sm font-medium text-on-error-container">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex gap-4 w-full">
          <Input label="Imię" id="firstName" placeholder="Wpisz imię" value={formData.firstName} onChange={handleChange} />
          <Input label="Nazwisko" id="lastName" placeholder="Wpisz nazwisko" value={formData.lastName} onChange={handleChange} />
        </div>

        <Input label="Nazwa firmy" id="companyName" placeholder="Np. Auto-Handel Kowalski" value={formData.companyName} onChange={handleChange} />
        <Input label="Adres e-mail" id="email" type="email" placeholder="jan@kowalski.pl" value={formData.email} onChange={handleChange} />
        
        <div className="relative">
          <Input label="Hasło" id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          <p className="font-label-sm text-xs text-outline mt-1 absolute -bottom-5">Minimum 8 znaków</p>
        </div>

        <div className="mt-6 flex flex-col gap-4 items-center">
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? <span>Tworzenie konta...</span> : (
              <>
                <span>Zarejestruj się</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </Button>
          
          <p className="font-label-md text-sm text-on-surface-variant mt-2">
            Masz już konto?{' '}
            <Link to="/login" className="text-secondary font-bold hover:underline transition-all">
              Zaloguj się
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}