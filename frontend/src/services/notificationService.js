import axiosInstance from './api/axiosConfig';

const notificationService = {
  // Get notifications (paginated)
  getNotifications: async (page = 0, size = 20, unreadOnly = false, type = null) => {
    const params = { page, size };
    if (unreadOnly) params.unreadOnly = true;
    if (type) params.type = type;
    
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await axiosInstance.get('/notifications/unread/count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete read notifications
  deleteReadNotifications: async () => {
    const response = await axiosInstance.delete('/notifications/read');
    return response.data;
  },
};

export default notificationService;
