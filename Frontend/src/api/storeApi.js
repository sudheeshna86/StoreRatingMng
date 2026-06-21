import apiClient from './apiClient';

export const getStores = async (params) => {
  const response = await apiClient.get('/stores', { params });
  return response.data;
};

export const submitRating = async (storeId, payload) => {
  const response = await apiClient.post(`/stores/${storeId}/rating`, payload);
  return response.data;
};

export const updateRating = async (storeId, payload) => {
  const response = await apiClient.put(`/stores/${storeId}/rating`, payload);
  return response.data;
};
