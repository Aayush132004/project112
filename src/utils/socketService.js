import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.initialized = false;
  }

  initialize(token) {
    if (this.initialized) return this.socket;

    // Connect to your socket.io server
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.initialized = true;
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.initialized = false;
    }
  }
}

export default new SocketService();
