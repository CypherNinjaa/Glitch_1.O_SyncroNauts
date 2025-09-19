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
            sx={{ 
              mt: 1,
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 2,
              p: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
              }
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#6366f1',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <EventIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Events</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                No recent events found. Create your first event to get started and bring your group together!
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Create Event
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'rgba(107, 114, 128, 0.04)',
            border: '1px solid rgba(107, 114, 128, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#6b7280',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ChatIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Group Chat</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Stay connected with your group members and plan together in real-time
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Join Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.04)',
            border: '1px solid rgba(16, 185, 129, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#10b981',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MoneyIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Expense Tracking</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Keep track of group expenses and split costs fairly among all members
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                View Expenses
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: 'rgba(107, 114, 128, 0.04)',
            border: '1px solid rgba(107, 114, 128, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#6b7280',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GroupIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Group Members</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Manage your group and invite new members to join your adventures
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Manage Group
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ 
        p: 4, 
        mt: 6, 
        textAlign: 'center',
        backgroundColor: 'rgba(99, 102, 241, 0.02)',
        border: '1px solid rgba(99, 102, 241, 0.08)',
        borderRadius: 3
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Quick Actions
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          maxWidth: 600,
          mx: 'auto'
        }}>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 2,
              fontWeight: 600,
              minWidth: 160
            }}
          >
            Create New Event
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 2,
              fontWeight: 600,
              minWidth: 160,
              borderWidth: 1.5,
              '&:hover': {
                borderWidth: 1.5,
              }
            }}
          >
            Join Existing Group
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 2,
              fontWeight: 600,
              minWidth: 160,
              borderWidth: 1.5,
              '&:hover': {
                borderWidth: 1.5,
              }
            }}
          >
            View Calendar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;