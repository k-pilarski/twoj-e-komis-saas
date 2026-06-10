// src/services/vehicleService.js
const API_URL = 'http://localhost:5000/api/vehicles';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchVehicles = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch vehicles');
  return response.json();
};

export const createVehicle = async (vehicleData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(vehicleData),
  });
  if (!response.ok) throw new Error('Failed to create vehicle');
  return response.json();
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(vehicleData),
  });
  if (!response.ok) throw new Error('Failed to update vehicle');
  return response.json();
};

export const deleteVehicle = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete vehicle');
  return response.json();
};

export const fetchVehicleById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch vehicle details');
  return response.json();
};