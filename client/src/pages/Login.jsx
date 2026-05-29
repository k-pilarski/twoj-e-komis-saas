import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const { loginUser, error, setError, isLoading } = useLogin();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(formData.email, formData.password);
  };

  return (
    <AuthLayout>
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Witaj ponownie</h1>
        <p className="text-on-surface-variant">Zaloguj się, aby uzyskać dostęp do panelu zarządzania flotą.</p>
      </section>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error-container border border-[#ffb4ab] flex items-start gap-3">
          <span className="material-symbols-outlined text-on-error-container mt-0.5">error</span>
          <p className="text-sm font-medium text-on-error-container">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input 
          label="Adres e-mail" 
          id="email" 
          type="email" 
          placeholder="jan.kowalski@firma.pl" 
          value={formData.email} 
          onChange={handleChange} 
        />
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <label className="font-label-md text-sm text-primary font-semibold" htmlFor="password">Hasło</label>
            <a href="#" className="font-label-sm text-xs text-secondary hover:underline transition-all">Zapomniałeś hasła?</a>
          </div>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 bg-surface-container-lowest border ${error ? 'border-error' : 'border-outline-variant'} rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder-outline shadow-sm`} 
            />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">visibility_off</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-[-8px]">
          <input type="checkbox" id="remember" className="rounded border-outline-variant text-secondary focus:ring-secondary focus:ring-offset-background w-4 h-4" />
          <label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer select-none">Zapamiętaj mnie</label>
        </div>

        <div className="mt-4 flex flex-col gap-4 items-center">
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? <span>Logowanie...</span> : <span>Zaloguj się</span>}
          </Button>
          
          <p className="font-label-md text-sm text-on-surface-variant mt-2">
            Nie masz konta?{' '}
            <Link to="/register" className="text-secondary font-bold hover:underline transition-all">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}