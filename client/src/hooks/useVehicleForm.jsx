import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createVehicle, updateVehicle, fetchVehicleById } from '../services/vehicleService';

export function useVehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pobieranie ID z paska adresu
  const isEditMode = Boolean(id); // Jeśli mamy ID, jesteśmy w trybie edycji

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode); // Ładowane tylko jeśli to tryb edycji

  // Pobieranie danych pojazdu przy wejściu w tryb edycji
  useEffect(() => {
    if (isEditMode) {
      const loadVehicle = async () => {
        try {
          const data = await fetchVehicleById(id);
          setFormData({
            brand: data.brand,
            model: data.model,
            year: data.year,
            price: data.price,
            description: data.description || ''
          });
        } catch (err) {
          setError('Nie udało się pobrać danych pojazdu.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadVehicle();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateVehicle(id, formData);
      } else {
        await createVehicle(formData);
      }
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
    isLoading,
    isEditMode,
    handleChange,
    handleSubmit
  };
}