import axiosInstance from './axiosInstance';
import { ENDPOINT } from './httpEndpoint';

// Get slot availability
export const getSlotAvailability = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINT.API.SLOT.AVAILABILITY, { params });
  return response.data;
};
