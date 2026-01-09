import { Server } from 'socket.io';

const rooms = new Map();

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log('Initializing Socket.IO server...');
        
        const io = new Server(res.socket.server, {
            path: '/api/socketio',
            addTrailingSlash: false,
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        
        io.on('connection', (socket) => {
            console.log('New connection: ' + socket.id);

            socket.on('createRoom', () => {
                const roomCode = generateRoomCode();
                const room = {
                    code: roomCode,
                    players: [socket.id],
                    white: socket.id,
                    black: null
                };
                
                rooms.set(roomCode, room);
                socket.join(roomCode);
                
                socket.emit('roomCreated', {
                    roomCode: roomCode,
                    color: 'white'
                });
                
                console.log(`Room created: ${roomCode}`);
            });

            socket.on('joinRoom', (roomCode) => {
                const room = rooms.get(roomCode);
                
                if (!room) {
                    socket.emit('error', { message: 'Room not found' });
                    return;
                }
                
                if (room.players.length >= 2) {
                    socket.emit('error', { message: 'Room is full' });
                    return;
                }
                
                room.players.push(socket.id);
                room.black = socket.id;
                socket.join(roomCode);
                
                socket.emit('roomJoined', {
                    roomCode: roomCode,
                    color: 'black'
                });
                
                socket.to(roomCode).emit('opponentJoined');
                
                console.log(`Player joined room: ${roomCode}`);
            });

            socket.on('move', (data) => {
                socket.to(data.room).emit('move', {
                    move: data.move
                });
            });

            socket.on('disconnect', () => {
                console.log('Disconnected: ' + socket.id);
                
                rooms.forEach((room, code) => {
                    if (room.players.includes(socket.id)) {
                        socket.to(code).emit('opponentDisconnected');
                        
                        const otherPlayerConnected = room.players.some(playerId => {
                            return playerId !== socket.id && io.sockets.sockets.has(playerId);
                        });
                        
                        if (!otherPlayerConnected) {
                            rooms.delete(code);
                            console.log(`Room deleted: ${code}`);
                        }
                    }
                });
            });
        });
        
        res.socket.server.io = io;
    }
    
    res.end();
}