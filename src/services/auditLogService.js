import axiosInstance from './axiosInstance';
import { ENDPOINT } from './httpEndpoint';

// Get all audit logs for current user
export const getMyAuditLogs = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINT.API.DELIVERY.AUDIT_LOGS, { params });
  return response.data;
};

// Get audit log by ID
export const getAuditLogById = async (id) => {
  const response = await axiosInstance.get(ENDPOINT.API.DELIVERY.AUDIT_LOG_BY_ID(id));
  return response.data;
};
