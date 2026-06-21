import apiClient from './apiClient';

export const login = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

export const register = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await apiClient.put('/auth/change-password', payload);
  return response.data;
};
