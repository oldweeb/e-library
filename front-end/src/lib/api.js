const API_URL = '/api';

export const login = async (body, method) => {
  const response = await fetch(`${API_URL}/auth/${method}`, {
    method: 'POST',
    body: body
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errorText || 'Failed to authorize.');
  }
  
  
};