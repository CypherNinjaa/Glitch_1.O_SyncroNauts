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
          
          <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GroupIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Room Access</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Room ID"
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupIcon />
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
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
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
                sx={{ mb: 2 }}
              >
                Join Room
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
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
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">
            Room: {roomId} | Members Online: 3
          </Typography>
        </Paper>
        
        <Paper sx={{ flex: 1, p: 2, mb: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {messages.map((msg) => (
              <ListItem key={msg.id}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={msg.user}
                  secondary={
                    <Box>
                      <Typography variant="body2">{msg.message}</Typography>
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
        
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
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