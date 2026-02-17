import axiosInstance from './axiosInstance';
import { ENDPOINT } from './httpEndpoint';

const adminAuditLogService = {
  getAuditLogs: (params) => axiosInstance.get(ENDPOINT.API.ADMIN_AUDIT.GET_ALL, { params }),
  getAuditLogById: (id) => axiosInstance.get(ENDPOINT.API.ADMIN_AUDIT.GET_BY_ID(id)),
};

export default adminAuditLogService;
