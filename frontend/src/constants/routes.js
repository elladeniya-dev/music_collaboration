// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  JOB_BOARD: '/job',
  JOB_DETAILS: '/jobs/:id',
  EDIT_JOB: '/job/:id',
  POST_JOB: '/post',
  COLLAB_REQUESTS: '/requests',
  CHAT: '/chat',
  CHAT_WITH_USER: '/chat/:id',
};

// Navigation Menu Items
export const NAV_ITEMS = [
  { label: 'Job Board', path: '/job', icon: 'work' },
  { label: 'Post Job', path: '/post', icon: 'add' },
  { label: 'Requests', path: '/requests', icon: 'inbox' },
  { label: 'Chat', path: '/chat', icon: 'chat' },
];
