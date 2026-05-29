import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (formData) => {
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.companyName || !formData.email || !formData.password) {
      setError('Proszę wypełnić wszystkie pola formularza.');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Twoje hasło musi mieć co najmniej 8 znaków.');
      return false;
    }

    setIsLoading(true);

    try {
      const safeSlug = formData.companyName
        .toLowerCase()
        .replace(/[ąàáâãäå]/g, 'a').replace(/[ćç]/g, 'c').replace(/[ęèéêë]/g, 'e')
        .replace(/[ł]/g, 'l').replace(/[ńñ]/g, 'n').replace(/[óòóôõö]/g, 'o')
        .replace(/[ś]/g, 's').replace(/[źż]/g, 'z')
        .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        tenantName: formData.companyName,
        tenantSlug: safeSlug,
        email: formData.email,
        password: formData.password
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