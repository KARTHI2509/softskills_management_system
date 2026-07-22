/*
------------------------------------------------
File: AuthContext.jsx
Purpose: Global authentication state manager context.
Responsibilities: Registers login/logout actions, handles local storage token buffers, wraps context providers.
Dependencies: react, axios
------------------------------------------------
*/

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token configurations with axios defaults
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axiosClient.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  /*
  Fetches user profile based on current JWT.
  */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // ONLY logout if token is explicitly expired or invalid (HTTP 401)
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };


  /*
  Authenticates credentials and registers session.
  */
  const login = async (email, password, role) => {
    try {
      const res = await axiosClient.post('/auth/login', { email, password, role });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed, check network logs.' 
      };
    }
  };

  /*
  Registers a new account.
  */
  const register = async (userData) => {
    try {
      const res = await axiosClient.post('/auth/register', userData);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  /*
  Logs out user session.
  */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };


  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

