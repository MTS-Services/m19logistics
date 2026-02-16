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

// Export invoice as PDF
export const exportInvoicePDF = async (id) => {
  const response = await axiosInstance.get(ENDPOINT.API.INVOICE.EXPORT_PDF(id), {
    responseType: 'blob', // Important for file download
  });
  return response;
};

// ====== Admin Invoice Management ======

// Get all invoices (Admin)
export const getAllAdminInvoices = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINT.API.ADMIN_INVOICE.GET_ALL, { params });
  return response.data;
};

// Get invoice by ID (Admin)
export const getAdminInvoiceById = async (id) => {
  const response = await axiosInstance.get(ENDPOINT.API.ADMIN_INVOICE.GET_BY_ID(id));
  return response.data;
};

// Create new invoice (Admin)
export const createAdminInvoice = async (invoiceData) => {
  const response = await axiosInstance.post(ENDPOINT.API.ADMIN_INVOICE.CREATE, invoiceData);
  return response.data;
};

// Update invoice (Admin)
export const updateAdminInvoice = async (id, invoiceData) => {
  const response = await axiosInstance.put(ENDPOINT.API.ADMIN_INVOICE.UPDATE(id), invoiceData);
  return response.data;
};

// Delete invoice (Admin)
export const deleteAdminInvoice = async (id) => {
  const response = await axiosInstance.delete(ENDPOINT.API.ADMIN_INVOICE.DELETE(id));
  return response.data;
};

// Export invoice as PDF (Admin)
export const exportAdminInvoicePDF = async (id) => {
  const response = await axiosInstance.get(ENDPOINT.API.ADMIN_INVOICE.EXPORT_PDF(id), {
    responseType: 'blob',
  });
  return response;
};

// Send invoice email (Admin)
export const sendAdminInvoiceEmail = async (id, emailData = {}) => {
  const response = await axiosInstance.post(ENDPOINT.API.ADMIN_INVOICE.SEND_EMAIL(id), emailData);
  return response.data;
};

// Update invoice status (Admin)
export const updateAdminInvoiceStatus = async (id, status) => {
  const response = await axiosInstance.patch(ENDPOINT.API.ADMIN_INVOICE.UPDATE_STATUS(id), {
    status,
  });
  return response.data;
};
