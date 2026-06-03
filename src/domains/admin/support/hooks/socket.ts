import io from 'socket.io-client';

const SOCKET_URL = `${import.meta.env.VITE_SERVER_URL}`;

const socket = io(SOCKET_URL, { transports: ['websocket'] });

socket.on('connect', () => {});

socket.on('connect_error', error => {
    // console.error('Live chat connection error:', error);
});

export default socket;
