// Route Paths
export const ENDPOINT = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/api/products?limit=5',
  },
  PRIVATE: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      GET_PROFILE: '/api/auth/me',
    },
    DELIVERY: {
      CREATE: '/api/deliveries',
      GET_ALL: '/api/deliveries',
      GET_BY_ID: (id) => `/api/deliveries/${id}`,
      STATS: '/api/deliveries/stats',
    },
    INVOICE: {
      GET_ALL: '/api/invoices',
      GET_BY_ID: (id) => `/api/invoices/${id}`,
      EXPORT_PDF: (id) => `/api/admin/invoices/${id}/export/pdf`,
    },
  },
};
