import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Refresh } from '@mui/icons-material';
import simpleChatClient from '../../lib/simple-chat';

const JoinChatRoom = ({ onRoomJoined }) => {
  const [formData, setFormData] = useState({
    roomId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(simpleChatClient.getCurrentUser());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'roomId' ? value.toUpperCase() : value 
    }));
    setError('');
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    
    if (!formData.roomId.trim()) {
      setError('Room ID is required');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomData = await simpleChatClient.joinRoom(formData.roomId.trim(), formData.password);
      console.log('Successfully joined room:', roomData);

      // Reset form
      setFormData({ roomId: '', password: '' });

      if (onRoomJoined) {
        onRoomJoined(roomData);
      }

    } catch (err) {
      console.error('Error joining room:', err);
      setError(err.message || 'Failed to join chat room');
    } finally {
      setLoading(false);
    }
  };

  const generateNewUser = () => {
    const newUser = simpleChatClient.generateNewUser();
    setCurrentUser(newUser);
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom color="primary" textAlign="center">
          Join Chat Room
        </Typography>
        
        {currentUser && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2">You are:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {currentUser.display_name}
                </Typography>
              </Box>
              <Button 
                size="small" 
                onClick={generateNewUser}
                startIcon={<Refresh />}
                sx={{ color: 'white', borderColor: 'white' }}
                variant="outlined"
              >
                New Name
              </Button>
            </Box>
          </Box>
        )}
        
        <Box component="form" onSubmit={joinRoom} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Room ID"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            placeholder="Enter room ID (e.g., ABC123)"
            margin="normal"
            required
            inputProps={{ 
              style: { 
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                fontSize: '1.1em'
              }
            }}
          />
          
          <TextField
            fullWidth
            label="Room Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter room password"
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                Joining Room...
              </Box>
            ) : (
              'Join Room'
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JoinChatRoom;