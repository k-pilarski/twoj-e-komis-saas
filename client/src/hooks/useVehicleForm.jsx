import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicle } from '../services/vehicleService';

export function useVehicleForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createVehicle(formData);
      navigate('/dashboard/inventory');
    } catch (err) {
      setError('Nie udało się zapisać pojazdu. Sprawdź dane i spróbuj ponownie.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit
  };
}