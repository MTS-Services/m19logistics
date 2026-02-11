import axiosInstance from './axiosInstance';
import { ENDPOINT } from './httpEndpoint';

// Get all invoices with optional filters
export const getAllInvoices = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINT.API.INVOICE.GET_ALL, { params });
  return response.data;
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  const response = await axiosInstance.get(ENDPOINT.API.INVOICE.GET_BY_ID(id));
  return response.data;
};
