import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles, deleteVehicle as apiDeleteVehicle } from '../services/vehicleService';

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

    // useCallback zapobiega niepotrzebnemu re-renderowaniu przy przekazywaniu funkcji w dół
  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError('Nie udało się załadować inwentarza. Spróbuj ponownie później.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const removeVehicle = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten pojazd?')) return false;
    
    try {
      await apiDeleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      throw new Error('Nie udało się usunąć pojazdu.');
    }
  };

  return { 
    vehicles, 
    isLoading, 
    error, 
    refreshVehicles: loadVehicles, 
    removeVehicle 
  };
}