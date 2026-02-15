// Route Paths
export const ENDPOINT = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/api/products',
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
      GET_ALL: '/api/admin/invoices',
      GET_BY_ID: (id) => `/api/admin/invoices/${id}`,
      EXPORT_PDF: (id) => `/api/admin/invoices/${id}/export/pdf`,
    },
    PRICING: {
      GET_ALL: '/api/admin/pricing-tiers',
      CREATE: '/api/admin/pricing-tiers',
      GET_BY_ID: (id) => `/api/admin/pricing-tiers/${id}`,
      UPDATE: (id) => `/api/admin/pricing-tiers/${id}`,
      DELETE: (id) => `/api/admin/pricing-tiers/${id}`,
    },
  },
};
