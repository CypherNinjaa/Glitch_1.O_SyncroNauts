import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/navigation/Sidebar';
import BottomNavigation from '../components/navigation/BottomNavigation';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Events from '../pages/Events';
import Profile from '../pages/Profile';
import Expenses from '../pages/Expenses';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar selectedTab={selectedTab} onTabChange={handleTabChange} />
      )}
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: isMobile ? 2 : 3,
          pb: isMobile ? 10 : 3, // More bottom padding for mobile to account for bottom nav
          overflow: 'auto',
          minHeight: '100vh'
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation selectedTab={selectedTab} onTabChange={handleTabChange} />
      )}
    </Box>
  );
};

export default MainLayout;