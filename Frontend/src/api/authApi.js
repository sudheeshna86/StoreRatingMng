import apiClient from './apiClient';

export const login = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

export const register = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};
