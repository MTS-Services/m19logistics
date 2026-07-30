import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getDriverType = (user) =>
  (user?.driverType || user?.driverProfile?.driverType || '').toString().toUpperCase();

/** Effective dashboard role: contractor drivers share role DRIVER with employee drivers. */
const getEffectiveRole = (user) => {
  const role = user?.role?.toLowerCase() || '';
  if (role === 'driver' && getDriverType(user) === 'CONTRACTOR') {
    return 'contractor';
  }
  return role;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRole = getEffectiveRole(user);
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(effectiveRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
