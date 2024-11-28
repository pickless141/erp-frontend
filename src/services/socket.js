import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_SERVER); 


socket.on('connect', () => {
  console.log('Conectado a Socket.IO:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Desconectado de Socket.IO');
});

export default socket;