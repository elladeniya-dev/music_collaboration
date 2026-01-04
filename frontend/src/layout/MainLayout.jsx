import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Work, Group, Chat, PostAdd } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { useUser } from '../context/UserContext';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, loadingUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate('/');
    }
  }, [user, loadingUser, navigate]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Check if current route is a chat page
  const isChatPage = location.pathname.startsWith('/chat');

  if (loadingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAF2FF' }}>
      {/* Sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </Box>

      {/* Main Section */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <AppBar position="static" elevation={1} sx={{ bgcolor: '#FAF2FF' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'black', flex: '0 0 auto' }}
            >
              HarmoniX
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flex: '1 1 auto' }}>
              <Button
                component={Link}
                to="/requests"
                startIcon={<Group />}
                sx={{ color: 'black', textTransform: 'none' }}
              >
                Collaborate
              </Button>
              <Button
                component={Link}
                to="/job"
                startIcon={<Work />}
                sx={{ color: 'black', textTransform: 'none' }}
              >
                Jobs
              </Button>
              <Button
                component={Link}
                to="/chat"
                startIcon={<Chat />}
                sx={{ color: 'black', textTransform: 'none' }}
              >
                Messages
              </Button>
              <Button
                component={Link}
                to="/post"
                startIcon={<PostAdd />}
                sx={{ color: 'black', textTransform: 'none' }}
              >
                Post Jobs
              </Button>
            </Box>
            <Box sx={{ width: 64 }} />
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            p: isChatPage ? 0 : 3,
            width: '100%',
            maxWidth: isChatPage ? '100%' : '1200px',
            mx: 'auto',
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
