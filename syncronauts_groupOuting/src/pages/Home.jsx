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
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 3,
              p: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
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
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
                  borderRadius: 3,
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
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(236, 72, 153, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)',
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
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
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
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
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
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        borderRadius: 4
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
              borderRadius: 3,
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
              borderRadius: 3,
              px: 4,
              py: 2,
              fontWeight: 600,
              minWidth: 160,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
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
              borderRadius: 3,
              px: 4,
              py: 2,
              fontWeight: 600,
              minWidth: 160,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
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