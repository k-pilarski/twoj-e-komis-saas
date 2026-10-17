// client/src/hooks/useSaleAgreement.js
import { useState, useRef } from 'react';
import { useVehicles } from './useVehicles';
import { generateSaleAgreement } from '../services/documentService';
import {
  formatSmartTitleCase,
  formatPositiveInteger,
  formatPrice,
  formatLicensePlate
} from '../utils/vehicleValidators';

export function useSaleAgreement() {
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    vehicleId: '',
    buyerType: 'PRIVATE',
    buyerName: '',
    buyerAddress: '',
    buyerPesel: '',
    buyerIdNumber: '',
    buyerNip: '',
    salePrice: '',
    salePlace: '',
    saleDate: todayStr,
    paymentMethod: 'GOTÓWKA',
    additionalNotes: ''
  });

  const [generatedAgreement, setGeneratedAgreement] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleVehicleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedCar = vehicles.find((v) => v.id === selectedId);

    setFormData((prev) => ({
      ...prev,
      vehicleId: selectedId,
      salePrice: selectedCar ? String(selectedCar.price) : prev.salePrice
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'buyerName' || name === 'salePlace') {
      formattedValue = formatSmartTitleCase(value);
    } else if (name === 'buyerPesel') {
      formattedValue = formatPositiveInteger(value).slice(0, 11);
    } else if (name === 'buyerNip') {
      formattedValue = formatPositiveInteger(value).slice(0, 10);
    } else if (name === 'buyerIdNumber') {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    } else if (name === 'salePrice') {
      formattedValue = formatPrice(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleBuyerTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      buyerType: type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    setError(null);
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const agreement = await generateSaleAgreement(formData);
      setGeneratedAgreement(agreement);
    } catch (err) {
      setError(err.message || 'Nie udało się wygenerować umowy. Sprawdź poprawność danych.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    vehicles,
    isLoadingVehicles,
    formData,
    generatedAgreement,
    error,
    isSubmitting,
    handleVehicleSelect,
    handleChange,
    handleBuyerTypeChange,
    handleSubmit
  };
}