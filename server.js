const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve static files from public directory
app.use(express.static('public'));

// Store active rooms
const rooms = new Map();

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
    console.log('New connection: ' + socket.id);

    // Create a new room
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

    // Join an existing room
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
        
        // Notify the white player that opponent joined
        socket.to(roomCode).emit('opponentJoined');
        
        console.log(`Player joined room: ${roomCode}`);
    });

    // Handle chess moves
    socket.on('move', (data) => {
        socket.to(data.room).emit('move', {
            move: data.move
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Disconnected: ' + socket.id);
        
        // Find and clean up rooms
        rooms.forEach((room, code) => {
            if (room.players.includes(socket.id)) {
                // Notify other player
                socket.to(code).emit('opponentDisconnected');
                
                // Remove room if both players are gone
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

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});