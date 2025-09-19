import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AccountBalanceWallet as ExpenseIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useTheme } from '../../App';

const drawerWidth = 240;

const navigationItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Chat', icon: <ChatIcon />, path: '/chat' },
  { label: 'Events', icon: <EventIcon />, path: '/events' },
  { label: 'Expenses', icon: <ExpenseIcon />, path: '/expenses' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="div" sx={{ 
          fontWeight: 700, 
          color: '#6366f1',
          mb: 0.5
        }}>
          SyncroNauts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Group Outing Planner
        </Typography>
      </Box>
      <Divider sx={{ mx: 2, opacity: 0.3 }} />
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: '#6366f1',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : 'text.secondary'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mx: 2, opacity: 0.3 }} />
      <Box sx={{ p: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6366f1',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#6366f1',
                  },
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {darkMode ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {darkMode ? 'Dark' : 'Light'} Mode
              </Typography>
            </Box>
          }
          sx={{ m: 0 }}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;