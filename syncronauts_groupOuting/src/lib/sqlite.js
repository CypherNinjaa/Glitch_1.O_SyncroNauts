// SQLite client wrapper to replace Supabase
class SQLiteClient {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
    this.token = localStorage.getItem('auth_token');
    this.ws = null;
    this.wsCallbacks = new Map();
  }

  // Auth methods
  auth = {
    signUp: async ({ email, password, options = {} }) => {
      const response = await fetch(`${this.baseURL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          displayName: options.data?.display_name || ''
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      this.token = data.token;
      
      return {
        data: { user: data.user },
        error: null
      };
    },

    signInWithPassword: async ({ email, password }) => {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      this.token = data.token;
      
      return {
        data: { user: data.user },
        error: null
      };
    },

    signOut: async () => {
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      localStorage.removeItem('auth_token');
      this.token = null;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      return { error: null };
    },

    getUser: async () => {
      if (!this.token) {
        return { data: { user: null }, error: null };
      }

      try {
        const response = await fetch(`${this.baseURL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          localStorage.removeItem('auth_token');
          this.token = null;
          return { data: { user: null }, error: null };
        }

        const data = await response.json();
        return { data: { user: data.user }, error: null };
      } catch (error) {
        localStorage.removeItem('auth_token');
        this.token = null;
        return { data: { user: null }, error: null };
      }
    },

    onAuthStateChange: (callback) => {
      // Initial call
      this.auth.getUser().then(({ data }) => {
        callback('SIGNED_IN', data.user);
      });

      // Return unsubscribe function
      return () => {};
    }
  };

  // Database methods
  from(table) {
    return {
      select: (columns = '*') => ({
        eq: (column, value) => this._buildQuery('SELECT', table, columns, { [column]: value }),
        in: (column, values) => this._buildQuery('SELECT', table, columns, { [column]: { in: values } }),
        order: (column, options = {}) => ({
          eq: (filterColumn, filterValue) => this._buildQuery('SELECT', table, columns, { [filterColumn]: filterValue }, { order: column, ...options })
        })
      }),
      
      insert: (data) => ({
        select: () => this._buildQuery('INSERT', table, '*', data)
      }),
      
      update: (data) => ({
        eq: (column, value) => this._buildQuery('UPDATE', table, data, { [column]: value })
      }),
      
      delete: () => ({
        eq: (column, value) => this._buildQuery('DELETE', table, null, { [column]: value })
      })
    };
  }

  async _buildQuery(method, table, columns, filter, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    let url, body, httpMethod;

    switch (method) {
      case 'SELECT':
        if (table === 'chat_rooms' && filter.id) {
          // Get room participants
          if (table === 'room_participants') {
            url = `${this.baseURL}/rooms/${filter.room_id}/participants`;
          } else {
            url = `${this.baseURL}/rooms/${filter.id}/messages`;
          }
          httpMethod = 'GET';
        }
        break;
        
      case 'INSERT':
        if (table === 'chat_rooms') {
          url = `${this.baseURL}/rooms`;
          body = JSON.stringify(filter);
          httpMethod = 'POST';
        } else if (table === 'room_participants') {
          url = `${this.baseURL}/rooms/${filter.room_id}/join`;
          body = JSON.stringify({ password: filter.password });
          httpMethod = 'POST';
        } else if (table === 'chat_messages') {
          url = `${this.baseURL}/rooms/${filter.room_id}/messages`;
          body = JSON.stringify({ content: filter.content });
          httpMethod = 'POST';
        }
        break;
    }

    try {
      const response = await fetch(url, {
        method: httpMethod,
        headers,
        credentials: 'include',
        body
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      const data = await response.json();
      return { data: Array.isArray(data) ? data : [data], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Real-time methods
  channel(channelName) {
    return {
      on: (eventType, filter, callback) => {
        if (!this.ws) {
          this._initWebSocket();
        }

        const key = `${channelName}_${eventType}_${JSON.stringify(filter)}`;
        this.wsCallbacks.set(key, callback);

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this._joinRoom(filter.room_id);
        }

        return {
          unsubscribe: () => {
            this.wsCallbacks.delete(key);
          }
        };
      },

      subscribe: () => {
        // Auto-subscribe when channel is created
        return { error: null };
      }
    };
  }

  _initWebSocket() {
    if (!this.token) return;

    this.ws = new WebSocket('ws://localhost:3001');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        if (data.type === 'new_message') {
          this.wsCallbacks.forEach((callback, key) => {
            if (key.includes('postgres_changes') && key.includes('chat_messages')) {
              callback({
                eventType: 'INSERT',
                new: data.message,
                old: null,
                schema: 'public',
                table: 'chat_messages'
              });
            }
          });
        } else if (data.type === 'participant_joined') {
          this.wsCallbacks.forEach((callback, key) => {
            if (key.includes('postgres_changes') && key.includes('room_participants')) {
              callback({
                eventType: 'INSERT',
                new: { user_id: data.user_id },
                old: null,
                schema: 'public',
                table: 'room_participants'
              });
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (this.token) {
          this._initWebSocket();
        }
      }, 3000);
    };
  }

  _joinRoom(roomId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.token) {
      this.ws.send(JSON.stringify({
        type: 'join_room',
        roomId,
        token: this.token
      }));
    }
  }

  // RPC methods (for custom functions)
  rpc(functionName, params = {}) {
    return this._buildQuery('RPC', functionName, null, params);
  }
}

// Create and export client instance
const sqliteClient = new SQLiteClient();
export default sqliteClient;