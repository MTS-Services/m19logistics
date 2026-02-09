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
    // Check for stored user data and token on mount
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

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toLowerCase() === 'admin',
    isDriver: user?.role?.toLowerCase() === 'driver',
    isCustomer: user?.role?.toLowerCase() === 'customer',
    isManager: user?.role?.toLowerCase() === 'manager',
    isAreaManager: user?.role?.toLowerCase() === 'area_manager',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
