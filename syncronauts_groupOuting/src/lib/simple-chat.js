// Simple user management without authentication
class SimpleUserManager {
  constructor() {
    this.currentUser = this.getOrCreateUser();
  }

  getOrCreateUser() {
    let user = localStorage.getItem('simple_user');
    
    if (!user) {
      // Generate random user
      const randomNames = [
        'ChatMaster', 'CoolUser', 'MessageSender', 'TalkativePerson', 
        'QuickTyper', 'FriendlyChatter', 'ActiveUser', 'SocialBee',
        'Communicator', 'Networker', 'Connector', 'SpeechBubble',
        'WordSmith', 'TextPro', 'ChatExpert', 'ConvoKing'
      ];
      
      const randomColors = [
        '#1976d2', '#388e3c', '#f57c00', '#d32f2f', 
        '#7b1fa2', '#5d4037', '#0288d1', '#689f38'
      ];
      
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomNumber = Math.floor(Math.random() * 9999);
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        display_name: `${randomName}${randomNumber}`,
        email: `${randomName.toLowerCase()}${randomNumber}@temp.com`,
        avatar_color: randomColor,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('simple_user', JSON.stringify(user));
    } else {
      user = JSON.parse(user);
    }
    
    return user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Generate new user (for testing)
  generateNewUser() {
    localStorage.removeItem('simple_user');
    this.currentUser = this.getOrCreateUser();
    return this.currentUser;
  }
}

// Simple client for chat operations without auth
class SimpleChatClient {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
    this.userManager = new SimpleUserManager();
    this.ws = null;
    this.wsCallbacks = new Map();
  }

  getCurrentUser() {
    return this.userManager.getCurrentUser();
  }

  generateNewUser() {
    return this.userManager.generateNewUser();
  }

  // Create room
  async createRoom(name, password) {
    const response = await fetch(`${this.baseURL}/rooms/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        password,
        user: this.getCurrentUser()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create room');
    }

    return await response.json();
  }

  // Join room
  async joinRoom(roomId, password) {
    const response = await fetch(`${this.baseURL}/rooms/${roomId}/join/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        user: this.getCurrentUser()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join room');
    }

    return await response.json();
  }

  // Get messages
  async getMessages(roomId) {
    const response = await fetch(`${this.baseURL}/rooms/${roomId}/messages/simple?user_id=${this.getCurrentUser().id}`);

    if (!response.ok) {
      throw new Error('Failed to load messages');
    }

    return await response.json();
  }

  // Send message
  async sendMessage(roomId, content) {
    const response = await fetch(`${this.baseURL}/rooms/${roomId}/messages/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content.trim(),
        user: this.getCurrentUser()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  }

  // Get participants
  async getParticipants(roomId) {
    const response = await fetch(`${this.baseURL}/rooms/${roomId}/participants/simple?user_id=${this.getCurrentUser().id}`);

    if (!response.ok) {
      throw new Error('Failed to load participants');
    }

    return await response.json();
  }

  // WebSocket for real-time
  initWebSocket(roomId) {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket('ws://localhost:3001');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.ws.send(JSON.stringify({
        type: 'join_room',
        roomId,
        user: this.getCurrentUser()
      }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        this.wsCallbacks.forEach((callback) => {
          callback(data);
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (roomId) {
          this.initWebSocket(roomId);
        }
      }, 3000);
    };
  }

  onMessage(callback) {
    const id = Math.random().toString(36);
    this.wsCallbacks.set(id, callback);
    
    return () => {
      this.wsCallbacks.delete(id);
    };
  }

  closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.wsCallbacks.clear();
  }
}

// Create and export client instance
const simpleChatClient = new SimpleChatClient();
export default simpleChatClient;