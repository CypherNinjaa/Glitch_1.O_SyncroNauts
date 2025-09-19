import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Beach Trip',
      description: 'Fun day at the beach with water sports',
      date: '2025-10-15',
      time: '09:00',
      location: 'Santa Monica Beach',
      attendees: 8,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Movie Night',
      description: 'Group movie screening at the cinema',
      date: '2025-10-20',
      time: '19:00',
      location: 'AMC Theater',
      attendees: 5,
      status: 'planning'
    }
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, {
        ...newEvent,
        id: events.length + 1,
        attendees: 1,
        status: 'planning'
      }]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: ''
      });
      setOpenDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'planning': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    {event.title}
                  </Typography>
                  <Chip
                    label={event.status}
                    color={getStatusColor(event.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.date} at {event.time}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.attendees} attendees
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                  <Button size="small" variant="outlined" sx={{ ml: 'auto' }}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events;