const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database', 'chat.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
const initSql = fs.readFileSync(path.join(__dirname, 'database', 'init.sql'), 'utf8');
db.exec(initSql, (err) => {
  if (err) {
    console.error('Error initializing database:', err);
  } else {
    console.log('Database initialized successfully');
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert user
    db.run(
      'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
      [email, passwordHash, displayName],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Get the created user
        db.get('SELECT id, email, display_name, created_at FROM users WHERE id = ?', [this.lastID], (err, user) => {
          if (err) {
            return res.status(500).json({ error: 'Error retrieving user' });
          }
          
          // Create token
          const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
          
          // Set cookie
          res.cookie('auth_token', token, { 
            httpOnly: true, 
            secure: false, // Set to true in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          });
          
          res.json({ user, token });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Create token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      
      // Set cookie
      res.cookie('auth_token', token, { 
        httpOnly: true, 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      });
      
      const { password_hash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, email, display_name, avatar_url, created_at FROM users WHERE id = ?', 
    [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  });
});

// Chat routes
app.post('/api/rooms', authenticateToken, (req, res) => {
  const { name, password } = req.body;
  
  bcrypt.hash(password, 10, (err, passwordHash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }
    
    db.run(
      'INSERT INTO chat_rooms (name, password_hash, created_by) VALUES (?, ?, ?)',
      [name, passwordHash, req.user.userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Get the created room
        db.get('SELECT * FROM chat_rooms WHERE id = ?', [this.lastID], (err, room) => {
          if (err) {
            return res.status(500).json({ error: 'Error retrieving room' });
          }
          
          // Add creator as participant
          db.run(
            'INSERT INTO room_participants (room_id, user_id) VALUES (?, ?)',
            [room.id, req.user.userId],
            () => {
              const { password_hash, ...roomWithoutPassword } = room;
              res.json(roomWithoutPassword);
            }
          );
        });
      }
    );
  });
});

app.post('/api/rooms/:roomId/join', authenticateToken, async (req, res) => {
  const { roomId } = req.params;
  const { password } = req.body;
  
  // Get room
  db.get('SELECT * FROM chat_rooms WHERE id = ? AND is_active = 1', [roomId], async (err, room) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, room.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    // Check if already participant
    db.get(
      'SELECT * FROM room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
      [roomId, req.user.userId],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existing) {
          return res.status(400).json({ error: 'Already a participant' });
        }
        
        // Check room capacity
        db.get(
          'SELECT COUNT(*) as count FROM room_participants WHERE room_id = ? AND is_active = 1',
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
              'INSERT INTO room_participants (room_id, user_id) VALUES (?, ?)',
              [roomId, req.user.userId],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Error joining room' });
                }
                
                const { password_hash, ...roomWithoutPassword } = room;
                res.json(roomWithoutPassword);
                
                // Broadcast to WebSocket clients
                broadcastToRoom(roomId, {
                  type: 'participant_joined',
                  user_id: req.user.userId
                });
              }
            );
          }
        );
      }
    );
  });
});

app.get('/api/rooms/:roomId/messages', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  
  // Verify user is participant
  db.get(
    'SELECT * FROM room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, req.user.userId],
    (err, participant) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!participant) {
        return res.status(403).json({ error: 'Not a participant of this room' });
      }
      
      // Get messages
      db.all(
        `SELECT cm.*, u.display_name, u.avatar_url 
         FROM chat_messages cm 
         JOIN users u ON cm.user_id = u.id 
         WHERE cm.room_id = ? 
         ORDER BY cm.created_at ASC`,
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

app.post('/api/rooms/:roomId/messages', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const { content } = req.body;
  
  // Verify user is participant
  db.get(
    'SELECT * FROM room_participants WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, req.user.userId],
    (err, participant) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!participant) {
        return res.status(403).json({ error: 'Not a participant of this room' });
      }
      
      // Insert message
      db.run(
        'INSERT INTO chat_messages (room_id, user_id, content) VALUES (?, ?, ?)',
        [roomId, req.user.userId, content],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          // Get the message with user info
          db.get(
            `SELECT cm.*, u.display_name, u.avatar_url 
             FROM chat_messages cm 
             JOIN users u ON cm.user_id = u.id 
             WHERE cm.id = ?`,
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

app.get('/api/rooms/:roomId/participants', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  
  // Verify user is participant or room creator
  db.get(
    `SELECT rp.*, cr.created_by 
     FROM room_participants rp 
     JOIN chat_rooms cr ON rp.room_id = cr.id 
     WHERE rp.room_id = ? AND rp.user_id = ? AND rp.is_active = 1`,
    [roomId, req.user.userId],
    (err, access) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!access && access?.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Get participants
      db.all(
        `SELECT rp.*, u.display_name, u.avatar_url, u.email 
         FROM room_participants rp 
         JOIN users u ON rp.user_id = u.id 
         WHERE rp.room_id = ? AND rp.is_active = 1 
         ORDER BY rp.joined_at ASC`,
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
        const { roomId, token } = data;
        
        // Verify token
        jwt.verify(token, JWT_SECRET, (err, user) => {
          if (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            return;
          }
          
          // Store client info
          clients.set(ws, { userId: user.userId, roomId });
          
          ws.send(JSON.stringify({ type: 'joined', roomId }));
        });
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
  console.log(`Server running on port ${PORT}`);
});