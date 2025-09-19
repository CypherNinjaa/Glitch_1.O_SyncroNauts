import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Box, 
  useTheme, 
  useMediaQuery, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Sidebar from '../components/navigation/Sidebar';
import BottomNavigation from '../components/navigation/BottomNavigation';
import ThemeToggle from '../components/ui/ThemeToggle';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Events from '../pages/Events';
import Profile from '../pages/Profile';
import Expenses from '../pages/Expenses';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  
  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={handleToggleSidebar}
          selectedTab={selectedTab} 
          onTabChange={handleTabChange} 
        />
      )}
      
      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Header */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            color: 'text.primary'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              {isMobile ? 'SyncroNauts' : 'Dashboard'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && <ThemeToggle />}
              
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ ml: isMobile ? 1 : 0 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, minWidth: 180 }}>
                  <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Profile
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Chat User
                    </Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: isMobile ? 2 : 3,
            pb: isMobile ? 12 : 3, // Increased bottom padding for mobile to account for the elevated bottom nav
            overflow: 'auto',
            bgcolor: 'background.default'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/events" element={<Events />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expenses" element={<Expenses />} />
          </Routes>
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation selectedTab={selectedTab} onTabChange={handleTabChange} />
      )}
    </Box>
  );
};

export default MainLayout;