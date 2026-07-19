/*
------------------------------------------------
File: placementService.js
Purpose: Service interface for placement analytical views.
Responsibilities: Gathers shortlist arrays and compares departments averages.
Dependencies: axiosClient
------------------------------------------------
*/

import axiosClient from '../api/axiosClient';

export default {
  /*
  Fetches eligible shortlist.
  */
  getEligibleStudents: (minCgpa, minScore) => {
    return axiosClient.get(`/placement/eligible?minCgpa=${minCgpa}&minScore=${minScore}`).then(res => res.data);
  },

  /*
  Fetches comparative department graphs database.
  */
  getDepartmentComparison: () => {
    return axiosClient.get('/placement/department-comparison').then(res => res.data);
  },

  /*
  Fetches corporate recruitment dashboard parameters.
  */
  getAnalytics: () => {
    return axiosClient.get('/placement/analytics').then(res => res.data);
  }
};
