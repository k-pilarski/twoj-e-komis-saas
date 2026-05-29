import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (email, password) => {
    setError('');

    if (!email || !password) {
      setError('Proszę wypełnić wszystkie pola logowania.');
      return false;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas logowania.');
      }

      localStorage.setItem('token', data.token);

      navigate('/dashboard');
      return true;
      
    } catch (err) {
      console.error('Błąd logowania:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { loginUser, error, setError, isLoading };
};