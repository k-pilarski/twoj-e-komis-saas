// client/src/hooks/useRegister.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

export const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (formData) => {
    setError('');

    const firstName = formData.firstName?.trim();
    const lastName = formData.lastName?.trim();
    const companyName = formData.companyName?.trim();
    const email = formData.email?.trim().toLowerCase();
    const password = formData.password || '';

    if (!firstName || !lastName || !companyName || !email || !password) {
      setError('Proszę wypełnić wszystkie pola formularza.');
      return false;
    }

    if (password.length < 8) {
      setError('Twoje hasło musi mieć co najmniej 8 znaków.');
      return false;
    }

    if (!SPECIAL_CHAR_REGEX.test(password)) {
      setError('Hasło musi zawierać co najmniej jeden znak specjalny (np. !@#$%^&*).');
      return false;
    }

    const safeSlug = companyName
      .toLowerCase()
      .replace(/[ąàáâãäå]/g, 'a').replace(/[ćç]/g, 'c').replace(/[ęèéêë]/g, 'e')
      .replace(/[ł]/g, 'l').replace(/[ńñ]/g, 'n').replace(/[óòôõö]/g, 'o')
      .replace(/[ś]/g, 's').replace(/[źż]/g, 'z')
      .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    if (!safeSlug || safeSlug.length < 2) {
      setError('Nazwa firmy musi zawierać co najmniej 2 litery lub cyfry.');
      return false;
    }

    setIsLoading(true);

    try {
      const payload = {
        firstName,
        lastName,
        tenantName: companyName,
        tenantSlug: safeSlug,
        email,
        password
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas rejestracji.');
      }

      navigate('/login');
      return true;
    } catch (err) {
      console.error('Błąd rejestracji:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { registerUser, error, setError, isLoading };
};