const API_URL = '/api';

export const login = async (formData, method) => {
  const response = await fetch(`${API_URL}/auth/${method}`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errorText || 'Failed to authorize.');
  }
  
  
};