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
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          SyncroNauts
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Group Outing Planner
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
              <Typography variant="body2">
                {darkMode ? 'Dark' : 'Light'} Mode
              </Typography>
            </Box>
          }
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;