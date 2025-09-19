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
        background: isDark 
          ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: isDark 
          ? '1px solid rgba(99, 102, 241, 0.2)'
          : '1px solid rgba(99, 102, 241, 0.1)',
        borderRadius: '24px 24px 0 0',
      }} 
      elevation={0}
    >
      <MuiBottomNavigation
        value={currentIndex}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            borderRadius: 3,
            mx: 0.5,
            my: 1,
            transition: 'all 0.3s ease-in-out',
            color: isDark ? 'rgba(226, 232, 240, 0.6)' : 'rgba(100, 116, 139, 0.8)',
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
            },
            '&:not(.Mui-selected)': {
              '& .MuiBottomNavigationAction-label': {
                fontWeight: 500,
                color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'rgba(100, 116, 139, 0.8)',
              },
              '& .MuiSvgIcon-root': {
                color: isDark ? 'rgba(226, 232, 240, 0.6)' : 'rgba(100, 116, 139, 0.7)',
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