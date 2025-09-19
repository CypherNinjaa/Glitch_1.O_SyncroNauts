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
  IconButton,
  Chip
} from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy, Refresh } from '@mui/icons-material';
import simpleChatClient from '../../lib/simple-chat';

const CreateChatRoom = ({ onRoomCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(simpleChatClient.getCurrentUser());
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const createRoom = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creating room with:', { name: formData.name, user: currentUser });
      
      const room = await simpleChatClient.createRoom(formData.name, formData.password);
      
      console.log('Room created successfully:', room);

      setCreatedRoom({
        ...room,
        password: formData.password
      });
      
      setSuccess('Chat room created successfully!');
      setFormData({ name: '', password: '' });
      
      if (onRoomCreated) {
        onRoomCreated(room);
      }

    } catch (err) {
      console.error('Error creating room:', err);
      setError(err.message || 'Failed to create chat room');
    } finally {
      setLoading(false);
    }
  };

  const generateNewUser = () => {
    const newUser = simpleChatClient.generateNewUser();
    setCurrentUser(newUser);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (createdRoom) {
    return (
      <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" textAlign="center">
            🎉 Room Created Successfully!
          </Typography>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Share this info to invite others:</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                Room ID:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mr: 1 }}>
                {createdRoom.id}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(createdRoom.id)}
                title="Copy Room ID"
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                Password:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mr: 1 }}>
                {createdRoom.password}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(createdRoom.password)}
                title="Copy Password"
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setCreatedRoom(null)}
            sx={{ mt: 3 }}
          >
            Create Another Room
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom color="primary" textAlign="center">
          Create Chat Room
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
        
        <Box component="form" onSubmit={createRoom} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Room Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter a name for your chat room"
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Room Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter a password for your room"
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

          <Button
            variant="outlined"
            onClick={generatePassword}
            sx={{ mt: 1, mb: 2 }}
            size="small"
          >
            Generate Random Password
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
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
                Creating Room...
              </Box>
            ) : (
              'Create Room'
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateChatRoom;