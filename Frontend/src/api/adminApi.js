import apiClient from './apiClient';

export const getDashboard = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const getUsers = async (params) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const createUser = async (payload) => {
  const response = await apiClient.post('/admin/users', payload);
  return response.data;
};

export const getStores = async (params) => {
  const response = await apiClient.get('/admin/stores', { params });
  return response.data;
};

export const createStore = async (payload) => {
  const response = await apiClient.post('/admin/stores', payload);
  return response.data;
};
