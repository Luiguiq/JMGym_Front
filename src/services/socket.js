import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const WS_URL = API_URL.replace('/api', '');

let socket = null;

export function getSocket() {
  if (socket?.connected) return socket;

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return null;

  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}