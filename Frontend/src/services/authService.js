/*
------------------------------------------------
File: authService.js
Purpose: Service interface for authentication operations.
Responsibilities: Routes API requests using Axios client configuration.
Dependencies: axiosClient
------------------------------------------------
*/

import axiosClient from '../api/axiosClient';

export default {
  /*
  Log in credentials checking.
  */
  login: (email, password) => {
    return axiosClient.post('/auth/login', { email, password }).then(res => res.data);
  },

  /*
  Register account fields creation.
  */
  register: (userData) => {
    return axiosClient.post('/auth/register', userData).then(res => res.data);
  },

  /*
  Fetches current session profile attributes.
  */
  getProfile: () => {
    return axiosClient.get('/auth/profile').then(res => res.data);
  },

  /*
  Dispatches reset code instructions.
  */
  forgotPassword: (email) => {
    return axiosClient.post('/auth/forgot-password', { email }).then(res => res.data);
  }
};
