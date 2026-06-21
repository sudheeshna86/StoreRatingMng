import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { clearAuth, getToken, getUser, storeAuth } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    const response = await loginApi(credentials);
    const { token: authToken, user: authUser } = response;
    storeAuth({ token: authToken, user: authUser });
    setToken(authToken);
    setUser(authUser);
    setLoading(false);
    return authUser;
  };

  const register = async (payload) => {
    const response = await registerApi(payload);
    return response;
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, logout, register }),
    [token, user, loading]
  );

  useEffect(() => {
    setToken(getToken());
    setUser(getUser());
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
