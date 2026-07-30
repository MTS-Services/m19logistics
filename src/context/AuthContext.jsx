import { createContext, useContext, useState, useEffect } from 'react';
import { setToken, setUser as saveUser, getToken, getUser, removeToken, removeUser } from '../utils/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    saveUser(userData);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    removeUser();
    removeToken();
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const role = user?.role?.toLowerCase() || '';
  const driverType = (
    user?.driverType ||
    user?.driverProfile?.driverType ||
    ''
  ).toString().toUpperCase();
  const isContractorDriver = role === 'driver' && driverType === 'CONTRACTOR';
  const isEmployeeDriver = role === 'driver' && driverType !== 'CONTRACTOR';

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    // Employee drivers only — contractors use contractor dashboard
    isDriver: isEmployeeDriver,
    // Legacy role "contractor" OR driver with driverType CONTRACTOR
    isContractor: role === 'contractor' || isContractorDriver,
    isCustomer: role === 'customer',
    isManager: role === 'manager',
    isAreaManager: role === 'area_manager',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
