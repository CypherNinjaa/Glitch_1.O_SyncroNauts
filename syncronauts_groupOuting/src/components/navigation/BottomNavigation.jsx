import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AccountBalanceWallet as ExpenseIcon
} from '@mui/icons-material';

const navigationItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Chat', icon: <ChatIcon />, path: '/chat' },
  { label: 'Events', icon: <EventIcon />, path: '/events' },
  { label: 'Expenses', icon: <ExpenseIcon />, path: '/expenses' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);

  const handleChange = (event, newValue) => {
    navigate(navigationItems[newValue].path);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: isDark 
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '12px 12px 0 0',
        pb: 'env(safe-area-inset-bottom)', // Handle iPhone home indicator
      }} 
      elevation={0}
    >
      <MuiBottomNavigation
        value={currentIndex}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'transparent',
          height: 'auto',
          py: 1,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            maxWidth: 'none',
            flex: 1,
            borderRadius: 2,
            mx: 0.25,
            py: 1,
            transition: 'all 0.2s ease-in-out',
            color: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
            '&.Mui-selected': {
              backgroundColor: '#6366f1',
              color: 'white',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'white',
                mt: 0.5,
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem',
                color: 'white',
              },
            },
            '&:not(.Mui-selected)': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 500,
                color: isDark ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                mt: 0.5,
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem',
                color: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
              },
            },
          },
        }}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;