import apiClient from './client';

// Registro de usuário
export const register = async (userData) => {
  return await apiClient.post('/auth/register', userData);
};

// Login de usuário
export const login = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

// Verificar token
export const verifyToken = async () => {
  return await apiClient.get('/auth/verify');
};

// Logout (apenas remove token localmente)
export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};
