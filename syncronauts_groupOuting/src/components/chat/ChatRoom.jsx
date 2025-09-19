import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider
} from '@mui/material';
import { 
  Send, 
  MoreVert, 
  ExitToApp, 
  Info, 
  People,
  ContentCopy
} from '@mui/icons-material';
import simpleChatClient from '../../lib/simple-chat';

const ChatRoom = ({ room, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    setCurrentUser(simpleChatClient.getCurrentUser());
  }, []);

  useEffect(() => {
    if (room && currentUser) {
      loadMessages();
      loadParticipants();
      
      // Set up WebSocket
      simpleChatClient.initWebSocket(room.id);
      
      const unsubscribe = simpleChatClient.onMessage((data) => {
        console.log('WebSocket message received:', data);
        
        if (data.type === 'new_message') {
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'participant_joined') {
          loadParticipants();
        }
      });

      return () => {
        unsubscribe();
        simpleChatClient.closeWebSocket();
      };
    }
  }, [room, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const messagesData = await simpleChatClient.getMessages(room.id);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    }
  };

  const loadParticipants = async () => {
    try {
      const participantsData = await simpleChatClient.getParticipants(room.id);
      setParticipants(participantsData);
    } catch (err) {
      console.error('Error loading participants:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setLoading(true);
    
    try {
      await simpleChatClient.sendMessage(room.id, newMessage.trim());
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const copyRoomInfo = () => {
    const roomInfo = `Room ID: ${room.id}\\nPassword: ${room.password || 'Contact room creator'}`;
    navigator.clipboard.writeText(roomInfo);
    handleMenuClose();
  };

  const leaveRoom = () => {
    handleMenuClose();
    if (onLeaveRoom) {
      onLeaveRoom();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!room) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No room selected
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">{room.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Room ID: {room.id} • {participants.length} participants
          </Typography>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVert />
        </IconButton>
      </Paper>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box
          ref={messagesContainerRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1,
            backgroundColor: '#fafafa'
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {messages.map((message, index) => (
                <ListItem key={message.id || index} sx={{ px: 1, py: 0.5 }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: message.avatar_color || '#1976d2',
                        width: 32, 
                        height: 32 
                      }}
                    >
                      {(message.display_name || 'U').charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" component="span">
                          {message.display_name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(message.created_at)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {message.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Message Input */}
      <Paper sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            variant="outlined"
            size="small"
            disabled={loading}
            multiline
            maxRows={4}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newMessage.trim()}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <Send />
          </Button>
        </Box>
      </Paper>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { setShowRoomInfo(true); handleMenuClose(); }}>
          <Info sx={{ mr: 1 }} />
          Room Info
        </MenuItem>
        <MenuItem onClick={() => { setShowParticipants(true); handleMenuClose(); }}>
          <People sx={{ mr: 1 }} />
          Participants ({participants.length})
        </MenuItem>
        <MenuItem onClick={copyRoomInfo}>
          <ContentCopy sx={{ mr: 1 }} />
          Copy Room Info
        </MenuItem>
        <Divider />
        <MenuItem onClick={leaveRoom} sx={{ color: 'error.main' }}>
          <ExitToApp sx={{ mr: 1 }} />
          Leave Room
        </MenuItem>
      </Menu>

      {/* Participants Dialog */}
      <Dialog open={showParticipants} onClose={() => setShowParticipants(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Participants ({participants.length})</DialogTitle>
        <DialogContent>
          <List>
            {participants.map((participant) => (
              <ListItem key={participant.user_id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: participant.avatar_color || '#1976d2' }}>
                    {(participant.display_name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={participant.display_name || 'Unknown User'}
                  secondary={`Joined ${new Date(participant.joined_at).toLocaleString()}`}
                />
                {participant.user_id === room.created_by && (
                  <Chip label="Creator" size="small" color="primary" />
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowParticipants(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Room Info Dialog */}
      <Dialog open={showRoomInfo} onClose={() => setShowRoomInfo(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Room Information</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Room Name</Typography>
            <Typography variant="body1" gutterBottom>{room.name}</Typography>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Room ID</Typography>
            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'monospace' }}>
              {room.id}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Created</Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(room.created_at).toLocaleString()}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Participants</Typography>
            <Typography variant="body1" gutterBottom>
              {participants.length} / {room.max_participants || 10}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={copyRoomInfo}>Copy Room Info</Button>
          <Button onClick={() => setShowRoomInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatRoom;