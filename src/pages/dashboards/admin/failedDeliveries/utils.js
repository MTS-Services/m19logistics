export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatMoney = (amount) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

export const getStatusStyle = (status) => {
  switch (status) {
    case 'Cancelled':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Pending Review':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Re-attempt Scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getReasonStyle = () => 'bg-red-50 text-red-700 border-red-200';
