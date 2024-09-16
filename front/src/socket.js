import { io } from 'socket.io-client';

const socket = io('http://localhost:5137');

export default socket;
