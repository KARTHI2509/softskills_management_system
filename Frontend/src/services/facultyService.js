/*
------------------------------------------------
File: facultyService.js
Purpose: Service interface for faculty dashboard widgets.
Responsibilities: Routes evaluation posts and assigns activities.
Dependencies: axiosClient
------------------------------------------------
*/

import axiosClient from '../api/axiosClient';

export default {
  /*
  Submits student evaluation grades.
  */
  submitEvaluation: (evaluationData) => {
    return axiosClient.post('/faculty/evaluation', evaluationData).then(res => res.data);
  },

  /*
  Assigns a soft skills practice activity.
  */
  assignActivity: (activityData) => {
    return axiosClient.post('/faculty/activities', activityData).then(res => res.data);
  },

  /*
  Fetches student files awaiting evaluation.
  */
  getPendingEvaluations: () => {
    return axiosClient.get('/faculty/pending-evaluations').then(res => res.data);
  }
};
