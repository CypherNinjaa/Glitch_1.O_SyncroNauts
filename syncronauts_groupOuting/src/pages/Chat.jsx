import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const Chat = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleJoinRoom = () => {
    if (roomId && password) {
      setIsJoined(true);
      // Add welcome message
      setMessages([
        {
          id: 1,
          user: 'System',
          message: `Welcome to room ${roomId}!`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: 'You',
        message: message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Join Group Chat
          </Typography>
          
          <Card sx={{ 
            maxWidth: 420, 
            mx: 'auto', 
            mt: 6,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GroupIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Room Access</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Room ID"
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleJoinRoom}
                disabled={!roomId || !password}
                size="large"
                sx={{ 
                  mb: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600
                }}
              >
                Join Room
              </Button>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">or</Typography>
              </Divider>
              
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ 
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Create New Room
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Room: {roomId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 members online
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e'
              }} />
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                Active
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper sx={{ 
          flex: 1, 
          p: 3, 
          mb: 3, 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(10px)',
        }}>
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {messages.map((msg) => (
              <ListItem key={msg.id} sx={{ mb: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {msg.user}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                      p: 2,
                      borderRadius: 3,
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      mt: 1
                    }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {msg.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {msg.timestamp}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        <Paper sx={{ 
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              variant="outlined"
              multiline
              maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 3,
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Chat;