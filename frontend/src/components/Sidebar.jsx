import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import NotificationBell from './NotificationBell';

const navItems = [
  { 
    label: 'Job Board', 
    path: '/job',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    label: 'Post Job', 
    path: '/post',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  { 
    label: 'Applications', 
    path: '/applications',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    label: 'Messages', 
    path: '/chat',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  { 
    label: 'Collab', 
    path: '/requests',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className={`${
        isCollapsed ? 'w-20' : 'w-56'
      } h-screen bg-slate-800 border-r border-slate-700 flex flex-col justify-between items-center py-6 px-3 sticky top-0 transition-all duration-300`}
    >
      {/* Top Section: Toggle + Menu */}
      <div className="w-full space-y-2">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {!isCollapsed && (
            <span className="text-sm font-medium">Menu</span>
          )}
        </button>

        {/* Navigation Items */}
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${
                isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={item.label}
            >
              <span className={`transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
              }`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Notifications + User Profile */}
      <div className="w-full space-y-2">
        {/* Notification Bell */}
        <div className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start px-3'}`}>
          <NotificationBell />
        </div>

        {/* User Profile */}
        <button
          onClick={() => navigate('/profile')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title="Profile"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover border-2 border-slate-600"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-slate-600">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          {!isCollapsed && (
            <span className="text-sm font-medium text-slate-200 truncate">
              {user?.name || 'Guest'}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
