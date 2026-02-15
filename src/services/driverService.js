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
