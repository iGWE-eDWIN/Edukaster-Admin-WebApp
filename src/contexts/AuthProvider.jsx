import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // const [users, setUsers] = useState([]); // ✅ store all users here
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const userData = await apiService.getCurrentUser();
        if (userData.user.role === 'admin') {
          setUser(userData.user);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // console.log(email);
      setError(null);
      setIsLoading(true);

      const response = await apiService.login({ email, password });
      // console.log(response);

      if (response.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // const loadUsers = async ({ role = 'all', search }) => {
  //   try {
  //     setIsLoading(true);
  //     setIsLoading(true);
  //     const response = await apiService.getAllUsers({
  //       role: role !== 'all' ? role : undefined,
  //       search: search || undefined,
  //     });
  //     setUsers(response.users || []); // ✅ store fetched users
  //   } catch (error) {
  //     console.error('Failed to load users:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
