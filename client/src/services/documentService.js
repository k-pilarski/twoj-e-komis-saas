// client/src/services/documentService.js
const API_URL = 'http://localhost:5000/api/documents';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const generateSaleAgreement = async (payload) => {
  const response = await fetch(`${API_URL}/sale-agreement`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Nie udało się wygenerować umowy.');
  }

  return data.agreement;
};