// client/src/services/publicService.js
const PUBLIC_API_URL = 'http://localhost:5000/api/public/komis';

export const fetchPublicStorefront = async (slug) => {
  const response = await fetch(`${PUBLIC_API_URL}/${encodeURIComponent(slug)}`);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Nie udało się załadować strony komisu.');
    error.status = response.status;
    throw error;
  }

  return data;
};