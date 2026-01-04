import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import notificationService from '../services/notificationService';

const NotificationBell = () => {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) {
      setHasError(true);
      return;
    }

    // Delay initial fetch by 500ms to let auth complete
    const initialTimer = setTimeout(() => {
      fetchUnreadCount();
    }, 500);

    // Poll for new notifications every 30 seconds (only after initial fetch)
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user || hasError) return;
    
    try {
      const data = await notificationService.getUnreadCount();
      // Handle both direct number and wrapped response
      const count = typeof data === 'number' ? data : (data?.data || 0);
      setUnreadCount(count);
      setHasError(false);
    } catch (error) {
      // Silently fail - backend might not be ready yet
      console.warn('Notifications not available:', error.message);
      setHasError(true);
      setUnreadCount(0);
    }
  };

  const fetchNotifications = async () => {
    if (notifications.length > 0 || !user || hasError) return; // Already loaded or not available
    
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(0, 10, true);
      // Handle both array and wrapped response
      const notifs = Array.isArray(data) ? data : (data?.data || []);
      setNotifications(notifs);
      setHasError(false);
    } catch (error) {
      console.warn('Could not fetch notifications:', error.message);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    if (hasError) return; // Don't open dropdown if notifications aren't available
    setShowDropdown(!showDropdown);
    if (!showDropdown && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.filter(n => n.id !== id));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'APPLICATION_ACCEPTED':
        return '🎉';
      case 'APPLICATION_SHORTLISTED':
        return '⭐';
      case 'APPLICATION_REJECTED':
        return '📋';
      case 'NEW_MESSAGE':
        return '💬';
      case 'JOB_POST_CLOSED':
        return '🔒';
      default:
        return '🔔';
    }
  };

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-700 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-4 text-center text-gray-400">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p>No unread notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm mb-1">
                            {notification.title}
                          </p>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {notification.highPriority && (
                          <span className="text-red-500 text-xs">!</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    // Navigate to notifications page
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 w-full text-center"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
