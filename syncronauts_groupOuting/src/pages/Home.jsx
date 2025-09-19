import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Group as GroupIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Chat as ChatIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../App';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleDarkMode } = useCustomTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexDirection: isMobile ? 'row' : 'column'
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Group Outing Planner
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Plan your perfect group adventure together
          </Typography>
        </Box>
        
        {/* Dark Mode Toggle - Mobile Only */}
        {isMobile && (
          <IconButton 
            onClick={toggleDarkMode} 
            color="inherit"
            sx={{ 
              mt: 1,
              border: 1,
              borderColor: 'divider'
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Events</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No recent events found. Create your first event to get started!
              </Typography>
              <Button variant="contained" color="primary">
                Create Event
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Group Chat</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Stay connected with your group members
              </Typography>
              <Button variant="outlined" color="primary">
                Join Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Expense Tracking</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Keep track of group expenses and split costs fairly
              </Typography>
              <Button variant="outlined" color="primary">
                View Expenses
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Group Members</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your group and invite new members
              </Typography>
              <Button variant="outlined" color="primary">
                Manage Group
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            Create New Event
          </Button>
          <Button variant="outlined" color="primary">
            Join Existing Group
          </Button>
          <Button variant="outlined" color="secondary">
            View Calendar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;