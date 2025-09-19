import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper
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
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { label: 'Expenses', icon: <ExpenseIcon />, path: '/expenses' },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        zIndex: 1000
      }} 
      elevation={3}
    >
      <MuiBottomNavigation
        value={currentIndex}
        onChange={handleChange}
        showLabels
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