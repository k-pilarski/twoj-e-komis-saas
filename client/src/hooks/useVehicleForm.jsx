// client/src/hooks/useVehicleForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createVehicle, updateVehicle, fetchVehicleById } from '../services/vehicleService';
import {
  formatSmartTitleCase,
  formatVin,
  formatLicensePlate,
  formatPositiveInteger,
  formatPrice,
  validateVehicleForm
} from '../utils/vehicleValidators';

const INTEGER_FIELDS = ['year', 'mileage', 'engineCapacity', 'enginePower', 'doors', 'seats'];

export function useVehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    brand: '', model: '', year: '', price: '', description: '',
    vin: '', licensePlate: '', firstRegistration: '', mileage: '',
    fuelType: '', engineCapacity: '', enginePower: '', transmission: '',
    drivetrain: '', bodyType: '', color: '', doors: '', seats: '',
    isDamaged: false, isImported: false, importedFrom: ''
  });
  
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  // Synchroniczna blokada chroniąca przed rapid double-clickiem (Punkt 5.1)
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isEditMode) {
      const loadVehicle = async () => {
        setIsLoading(true);
        setIsNotFound(false);
        try {
          const data = await fetchVehicleById(id);
          setFormData({
            brand: data.brand ?? '',
            model: data.model ?? '',
            year: data.year ?? '',
            price: data.price ?? '',
            description: data.description ?? '',
            vin: data.vin ?? '',
            licensePlate: data.licensePlate ?? '',
            firstRegistration: data.firstRegistration ?? '',
            mileage: data.mileage ?? '',
            fuelType: data.fuelType ?? '',
            engineCapacity: data.engineCapacity ?? '',
            enginePower: data.enginePower ?? '',
            transmission: data.transmission ?? '',
            drivetrain: data.drivetrain ?? '',
            bodyType: data.bodyType ?? '',
            color: data.color ?? '',
            doors: data.doors ?? '',
            seats: data.seats ?? '',
            isDamaged: Boolean(data.isDamaged),
            isImported: Boolean(data.isImported),
            importedFrom: data.importedFrom ?? ''
          });
        } catch (err) {
          setIsNotFound(true);
          setError('Pojazd nie istnieje lub nie masz uprawnień do jego edycji.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadVehicle();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'isImported' && !checked ? { importedFrom: '' } : {})
      }));
      return;
    }

    let formattedValue = value;

    if (name === 'brand' || name === 'model' || name === 'importedFrom') {
      formattedValue = formatSmartTitleCase(value);
    } else if (name === 'vin') {
      formattedValue = formatVin(value);
    } else if (name === 'licensePlate') {
      formattedValue = formatLicensePlate(value);
    } else if (name === 'price') {
      formattedValue = formatPrice(value);
    } else if (INTEGER_FIELDS.includes(name)) {
      formattedValue = formatPositiveInteger(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Natychmiastowa blokada przed wielokrotnym kliknięciem / Enterem
    if (isSubmittingRef.current || isNotFound) return;

    setError(null);

    // Przygotowanie danych (trimowanie spacji na końcach)
    const cleanedData = {
      ...formData,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      importedFrom: formData.isImported ? formData.importedFrom.trim() : null,
      color: formData.color.trim(),
      description: formData.description.trim()
    };

    const validationError = validateVehicleForm(cleanedData);
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateVehicle(id, cleanedData);
      } else {
        await createVehicle(cleanedData);
      }
      navigate('/dashboard/inventory');
    } catch (err) {
      setError(err.message || 'Nie udało się zapisać pojazdu. Sprawdź dane i spróbuj ponownie.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error(err);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    error,
    isNotFound,
    isSubmitting,
    isLoading,
    isEditMode,
    handleChange,
    handleSubmit
  };
}