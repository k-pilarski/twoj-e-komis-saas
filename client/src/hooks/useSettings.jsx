import { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../services/settingsService';

export function useSettings() {
  const [formData, setFormData] = useState({
    primaryColor: '#2563eb',
    layoutType: 'GRID',
    fontStyle: 'SANS',
    hasContactPage: true,
    hasRegulationsPage: false,
    phoneNumber: '',
    address: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setFormData({
          primaryColor: data.primaryColor || '#2563eb',
          layoutType: data.layoutType || 'GRID',
          fontStyle: data.fontStyle || 'SANS',
          hasContactPage: Boolean(data.hasContactPage),
          hasRegulationsPage: Boolean(data.hasRegulationsPage),
          phoneNumber: data.phoneNumber || '',
          address: data.address || ''
        });
      } catch (err) {
        setError('Nie udało się załadować konfiguracji wizytówki.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Specjalna funkcja dla kafelków z kolorami i układami
  const handleDirectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg('');

    try {
      await updateSettings(formData);
      setSuccessMsg('Ustawienia wizytówki zostały zapisane.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Błąd podczas zapisywania konfiguracji.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isLoading, isSubmitting, error, successMsg, handleChange, handleDirectChange, handleSubmit };
}