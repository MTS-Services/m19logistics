import axiosInstance from './axiosInstance';
import { ENDPOINT } from './httpEndpoint';

/**
 * Submit a contact form
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Name of the person
 * @param {string} contactData.email - Email address
 * @param {string} contactData.phone - Phone number
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} Response data
 */
export const submitContactForm = async (contactData) => {
  const response = await axiosInstance.post(ENDPOINT.PUBLIC.CONTACT, contactData);
  return response.data;
};

// Admin Contact Management APIs

/**
 * Get all contact submissions (Admin)
 * @param {Object} params - Query parameters
 * @param {boolean} params.isRead - Filter by read status (optional)
 * @returns {Promise<Object>} Response data with contacts array and count
 */
export const getAllContacts = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINT.API.ADMIN_CONTACT.GET_ALL, { params });
  return response.data;
};

/**
 * Mark a contact as read (Admin)
 * @param {number} id - Contact ID
 * @returns {Promise<Object>} Response data
 */
export const markContactAsRead = async (id) => {
  const response = await axiosInstance.post(ENDPOINT.API.ADMIN_CONTACT.MARK_READ(id));
  return response.data;
};

/**
 * Delete a contact (Admin)
 * @param {number} id - Contact ID
 * @returns {Promise<Object>} Response data
 */
export const deleteContact = async (id) => {
  const response = await axiosInstance.delete(ENDPOINT.API.ADMIN_CONTACT.DELETE(id));
  return response.data;
};
