import express from 'express';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database', 'chat.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Simple users table (no auth)
  db.run(`CREATE TABLE IF NOT EXISTS simple_users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    email TEXT,
    avatar_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Chat rooms
  db.run(`CREATE TABLE IF NOT EXISTS simple_chat_rooms (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_by TEXT NOT NULL,
    max_participants INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Room participants
  db.run(`CREATE TABLE IF NOT EXISTS simple_room_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_color TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    UNIQUE(room_id, user_id)
  )`);

  // Chat messages
  db.run(`CREATE TABLE IF NOT EXISTS simple_chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_color TEXT,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Simple room creation
app.post('/api/rooms/simple', (req, res) => {
  const { name, password, user } = req.body;
  
  db.run(
    'INSERT INTO simple_chat_rooms (name, password, created_by) VALUES (?, ?, ?)',
    [name, password, user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get the created room
      db.get('SELECT * FROM simple_chat_rooms WHERE rowid = ?', [this.lastID], (err, room) => {
        if (err) {
          return res.status(500).json({ error: 'Error retrieving room' });
        }
        
        // Add creator as participant
        db.run(
          'INSERT INTO simple_room_participants (room_id, user_id, display_name, avatar_color) VALUES (?, ?, ?, ?)',
          [room.id, user.id, user.display_name, user.avatar_color],
          () => {
            res.json(room);
          }
        );
      });
    }
  );
});

// Simple room joining
app.post('/api/rooms/:roomId/join/simple', (req, res) => {
  const { roomId } = req.params;
  const { password, user } = req.body;
  
  // Get room
  db.get('SELECT * FROM simple_chat_rooms WHERE id = ? AND is_active = 1', [roomId], (err, room) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Check password
    if (room.password !== password) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    // Check if already participant
    db.get(
      'SELECT * FROM simple_room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
      [roomId, user.id],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existing) {
          return res.json(room);
        }
        
        // Check room capacity
        db.get(
          'SELECT COUNT(*) as count FROM simple_room_participants WHERE room_id = ? AND is_active = 1',
          [roomId],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.count >= room.max_participants) {
              return res.status(400).json({ error: 'Room is full' });
            }
            
            // Add participant
            db.run(
              'INSERT OR REPLACE INTO simple_room_participants (room_id, user_id, display_name, avatar_color) VALUES (?, ?, ?, ?)',
              [roomId, user.id, user.display_name, user.avatar_color],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Error joining room' });
                }
                
                res.json(room);
                
                // Broadcast to WebSocket clients
                broadcastToRoom(roomId, {
                  type: 'participant_joined',
                  user: user
                });
              }
            );
          }
        );
      }
    );
  });
});

// Get messages
app.get('/api/rooms/:roomId/messages/simple', (req, res) => {
  const { roomId } = req.params;
  const { user_id } = req.query;
  
  // Verify user is participant
  db.get(
    'SELECT * FROM simple_room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, user_id],
    (err, participant) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!participant) {
        return res.status(403).json({ error: 'Not a participant of this room' });
      }
      
      // Get messages
      db.all(
        'SELECT * FROM simple_chat_messages WHERE room_id = ? ORDER BY created_at ASC',
        [roomId],
        (err, messages) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json(messages);
        }
      );
    }
  );
});

// Send message
app.post('/api/rooms/:roomId/messages/simple', (req, res) => {
  const { roomId } = req.params;
  const { content, user } = req.body;
  
  // Verify user is participant
  db.get(
    'SELECT * FROM simple_room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, user.id],
    (err, participant) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!participant) {
        return res.status(403).json({ error: 'Not a participant of this room' });
      }
      
      // Insert message
      db.run(
        'INSERT INTO simple_chat_messages (room_id, user_id, display_name, avatar_color, content) VALUES (?, ?, ?, ?, ?)',
        [roomId, user.id, user.display_name, user.avatar_color, content],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          // Get the message
          db.get(
            'SELECT * FROM simple_chat_messages WHERE id = ?',
            [this.lastID],
            (err, message) => {
              if (err) {
                return res.status(500).json({ error: 'Error retrieving message' });
              }
              
              res.json(message);
              
              // Broadcast to WebSocket clients
              broadcastToRoom(roomId, {
                type: 'new_message',
                message
              });
            }
          );
        }
      );
    }
  );
});

// Get participants
app.get('/api/rooms/:roomId/participants/simple', (req, res) => {
  const { roomId } = req.params;
  const { user_id } = req.query;
  
  // Verify user is participant
  db.get(
    'SELECT * FROM simple_room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, user_id],
    (err, access) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!access) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Get participants
      db.all(
        'SELECT * FROM simple_room_participants WHERE room_id = ? AND is_active = 1 ORDER BY joined_at ASC',
        [roomId],
        (err, participants) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json(participants);
        }
      );
    }
  );
});

// WebSocket handling
const clients = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'join_room') {
        const { roomId, user } = data;
        
        // Store client info
        clients.set(ws, { userId: user.id, roomId, user });
        
        ws.send(JSON.stringify({ type: 'joined', roomId }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

function broadcastToRoom(roomId, message) {
  clients.forEach((clientInfo, ws) => {
    if (clientInfo.roomId === roomId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Simple chat server running on port ${PORT}`);
});