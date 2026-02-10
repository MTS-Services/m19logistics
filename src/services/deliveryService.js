import axiosInstance from './axiosInstance';
import { ENDPOINT } from './httpEndpoint';

// Create a new delivery request
export const createDeliveryRequest = async (deliveryData) => {
  const response = await axiosInstance.post(ENDPOINT.API.DELIVERY.CREATE, deliveryData);
  return response.data;
};

// Get all delivery requests
export const getAllDeliveries = async () => {
  const response = await axiosInstance.get(ENDPOINT.API.DELIVERY.GET_ALL);
  return response.data;
};

// Get delivery by ID
export const getDeliveryById = async (id) => {
  const response = await axiosInstance.get(ENDPOINT.API.DELIVERY.GET_BY_ID(id));
  return response.data;
};
