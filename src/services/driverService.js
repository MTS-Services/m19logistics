import axiosInstance from './axiosInstance';

/**
 * Get driver dashboard data including stats and today's schedule
 * @returns {Promise} Promise with driver dashboard data
 */
export const getDriverDashboard = async () => {
  const response = await axiosInstance.get('/api/driver/dashboard');
  return response.data;
};

/**
 * Get driver deliveries by status and date
 * @param {string} status - Delivery status (e.g., 'ALLOCATED')
 * @param {string} startDate - Start date in YYYY-MM-DD format (optional)
 * @returns {Promise} Promise with deliveries data
 */
export const getDriverDeliveries = async (status, startDate) => {
  const params = {};
  if (status) params.status = status;
  if (startDate) params.startDate = startDate;

  const response = await axiosInstance.get('/api/driver/deliveries', {
    params,
  });
  return response.data;
};

/**
 * Respond to a delivery (accept or reject)
 * @param {number} deliveryId - Delivery ID
 * @param {string} action - 'accept' or 'reject'
 * @param {string} reason - Rejection reason (required if action is 'reject')
 * @returns {Promise} Promise with response data
 */
export const respondToDelivery = async (deliveryId, action, reason = null) => {
  const body = { action };
  if (action === 'reject' && reason) {
    body.reason = reason;
  }
  const response = await axiosInstance.post(`/api/driver/deliveries/${deliveryId}/respond`, body);
  return response.data;
};

/**
 * Upload delivery proof (photo, signature, and notes)
 * @param {number} deliveryId - Delivery ID
 * @param {FormData} formData - FormData containing photo, signature, receivedBy, and driverNotes
 * @returns {Promise} Promise with upload response data
 */
export const uploadDeliveryProof = async (deliveryId, formData) => {
  const response = await axiosInstance.post(
    `/api/driver/deliveries/${deliveryId}/upload-proof`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Complete a delivery
 * @param {number} deliveryId - Delivery ID
 * @param {string} receivedBy - Name of person who received the delivery
 * @returns {Promise} Promise with completion response data
 */
export const completeDelivery = async (deliveryId, receivedBy) => {
  const response = await axiosInstance.post(`/api/driver/deliveries/${deliveryId}/complete`, {
    receivedBy: receivedBy,
  });
  return response.data;
};
