/*
------------------------------------------------
File: notificationRouter.js
Purpose: Resolves notification item click target routes based on message text, explicit URLs, and user role.
------------------------------------------------
*/

export const getNotificationTarget = (notif, userRole = 'STUDENT') => {
  if (!notif) return '/notifications';

  // 1. Direct explicit target URL or link if provided in payload
  if (notif.target_url) return notif.target_url;
  if (notif.link) return notif.link;

  const msg = (notif.message || '').toLowerCase();

  // 2. Live 1-on-1 Interviews
  if (msg.includes('live interview') || msg.includes('interview room') || msg.includes('interview slot') || msg.includes('interview scheduled')) {
    if (notif.session_id) return `/live-interview/room/${notif.session_id}`;
    return '/live-interview/schedule';
  }

  // 3. Tasks & Assignments
  if (msg.includes('task') || msg.includes('assigned') || msg.includes('submission') || msg.includes('overdue') || msg.includes('evaluated')) {
    if (userRole === 'FACULTY' || userRole === 'ADMIN') return '/faculty/tasks';
    return '/student/tasks';
  }

  // 4. Mock Interviews / AI Interview
  if (msg.includes('mock interview') || msg.includes('speech score') || msg.includes('ai interview')) {
    return '/mock-interview';
  }

  // 5. Group Discussion
  if (msg.includes('group discussion') || msg.includes('gd topic') || msg.includes('gd score')) {
    return '/group-discussion';
  }

  // 6. Aptitude Tests & Questions
  if (msg.includes('aptitude') || msg.includes('test score') || msg.includes('questions')) {
    if (userRole === 'FACULTY') return '/faculty/questions';
    return '/aptitude';
  }

  // 7. Resume Analyzer & ATS Score
  if (msg.includes('resume') || msg.includes('ats score') || msg.includes('cv')) {
    return '/resume-builder';
  }

  // 8. Coding Arena / Challenges
  if (msg.includes('coding') || msg.includes('challenge') || msg.includes('problem')) {
    return '/coding';
  }

  // 9. Forum Posts & Discussions
  if (msg.includes('forum') || msg.includes('post') || msg.includes('comment') || msg.includes('liked')) {
    return '/forum';
  }

  // 10. Leaderboard & Badges
  if (msg.includes('leaderboard') || msg.includes('rank') || msg.includes('badge') || msg.includes('achievement')) {
    return '/leaderboard';
  }

  // 11. Progress Reports & Certificates
  if (msg.includes('certificate') || msg.includes('report') || msg.includes('grade') || msg.includes('overall score')) {
    return '/reports';
  }

  // 12. AI Advisor
  if (msg.includes('advisor') || msg.includes('recommendation') || msg.includes('career')) {
    return '/advisor';
  }

  // 13. Settings & Profile Security
  if (msg.includes('password') || msg.includes('profile') || msg.includes('security') || msg.includes('settings')) {
    return '/profile';
  }

  // Default dashboard fallback based on role
  if (userRole === 'FACULTY') return '/faculty/dashboard';
  if (userRole === 'PLACEMENT_OFFICER') return '/placement/dashboard';
  if (userRole === 'ADMIN') return '/admin/dashboard';
  return '/student/dashboard';
};

export const getNotificationCategoryLabel = (message = '') => {
  const msg = message.toLowerCase();
  if (msg.includes('live interview') || msg.includes('interview')) return 'Live Interview';
  if (msg.includes('task') || msg.includes('assigned') || msg.includes('overdue')) return 'Tasks & Assignments';
  if (msg.includes('mock interview')) return 'Mock Interview';
  if (msg.includes('group discussion') || msg.includes('gd')) return 'Group Discussion';
  if (msg.includes('aptitude') || msg.includes('test')) return 'Aptitude Test';
  if (msg.includes('resume')) return 'Resume Analyzer';
  if (msg.includes('coding') || msg.includes('challenge')) return 'Coding Arena';
  if (msg.includes('forum') || msg.includes('post')) return 'Peer Forum';
  if (msg.includes('leaderboard') || msg.includes('rank')) return 'Leaderboard';
  if (msg.includes('certificate') || msg.includes('report')) return 'Progress Reports';
  if (msg.includes('advisor')) return 'AI Career Advisor';
  return 'System Alert';
};
