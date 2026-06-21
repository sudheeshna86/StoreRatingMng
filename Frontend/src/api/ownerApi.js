import apiClient from './apiClient';

export const getDashboard = async () => {
  const response = await apiClient.get('/owner/dashboard');
  return response.data;
};

export const getRatings = async () => {
  const response = await apiClient.get('/owner/ratings');
  return response.data;
};
