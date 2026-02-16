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

/**
 * Submit an enquiry form
 * @param {Object} enquiryData - Enquiry form data
 * @param {string} enquiryData.fullName - Full name of the person
 * @param {string} enquiryData.companyName - Company name (optional)
 * @param {string} enquiryData.email - Email address
 * @param {string} enquiryData.phoneNumber - Phone number
 * @param {string} enquiryData.subject - Subject of enquiry
 * @param {string} enquiryData.message - Message content
 * @returns {Promise<Object>} Response data
 */
export const submitEnquiryForm = async (enquiryData) => {
  const response = await axiosInstance.post(ENDPOINT.PUBLIC.ENQUIRY, enquiryData);
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

// Admin Enquiry Management APIs

/**
 * Get all enquiry submissions (Admin)
 * @param {Object} params - Query parameters
 * @param {boolean} params.isRead - Filter by read status (optional)
 * @returns {Promise<Object>} Response data with enquiries array and count
 */
export const getAllEnquiries = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINT.API.ADMIN_ENQUIRY.GET_ALL, { params });
  return response.data;
};

/**
 * Mark an enquiry as read (Admin)
 * @param {number} id - Enquiry ID
 * @returns {Promise<Object>} Response data
 */
export const markEnquiryAsRead = async (id) => {
  const response = await axiosInstance.post(ENDPOINT.API.ADMIN_ENQUIRY.MARK_READ(id));
  return response.data;
};

/**
 * Delete an enquiry (Admin)
 * @param {number} id - Enquiry ID
 * @returns {Promise<Object>} Response data
 */
export const deleteEnquiry = async (id) => {
  const response = await axiosInstance.delete(ENDPOINT.API.ADMIN_ENQUIRY.DELETE(id));
  return response.data;
};
