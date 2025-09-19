import React, { useState } from 'react';
import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import CreateChatRoom from '../components/chat/CreateChatRoom';
import JoinChatRoom from '../components/chat/JoinChatRoom';
import ChatRoom from '../components/chat/ChatRoom';

const Chat = () => {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'create', 'join', 'chat'
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleRoomCreated = (room) => {
    setCurrentRoom(room);
    setCurrentView('chat');
  };

  const handleRoomJoined = (room) => {
    setCurrentRoom(room);
    setCurrentView('chat');
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentView('menu');
  };

  if (currentView === 'chat' && currentRoom) {
    return <ChatRoom room={currentRoom} onLeaveRoom={handleLeaveRoom} />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" textAlign="center" gutterBottom>
        💬 Simple Chat
      </Typography>
      
      <Typography variant="h6" textAlign="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        No sign-up required! Just pick a name and start chatting.
      </Typography>

      {currentView === 'menu' && (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 300 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                🆕 Create Room
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start a new chat room and invite others
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => setCurrentView('create')}
                size="large"
              >
                Create New Room
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 300 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                🚪 Join Room
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter a room ID and password to join
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => setCurrentView('join')}
                size="large"
              >
                Join Existing Room
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {currentView === 'create' && (
        <Box>
          <Button 
            onClick={() => setCurrentView('menu')} 
            sx={{ mb: 2 }}
          >
            ← Back to Menu
          </Button>
          <CreateChatRoom onRoomCreated={handleRoomCreated} />
        </Box>
      )}

      {currentView === 'join' && (
        <Box>
          <Button 
            onClick={() => setCurrentView('menu')} 
            sx={{ mb: 2 }}
          >
            ← Back to Menu
          </Button>
          <JoinChatRoom onRoomJoined={handleRoomJoined} />
        </Box>
      )}
    </Container>
  );
};

export default Chat;