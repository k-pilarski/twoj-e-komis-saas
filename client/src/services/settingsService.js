const API_URL = 'http://localhost:5000/api/settings';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const fetchSettings = async () => {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error('Nie udało się pobrać ustawień');
  return response.json();
};

export const updateSettings = async (settingsData) => {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settingsData)
  });
  if (!response.ok) throw new Error('Nie udało się zapisać ustawień');
  return response.json();
};