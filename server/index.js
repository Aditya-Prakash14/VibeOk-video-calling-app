const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json());

const emailToSocketMaping = new Map();



io.on('connection', (socket) => {
    console.log('A user connected:');
    socket.on('join-room', data => {
        const { roomId, emailId } = data;
        console.log('User joined room with data:', emailId, 'Joining Room:', roomId);
        emailToSocketMaping.set(emailId, socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined', { emailId });
    });

    // WebRTC signaling events
    socket.on('offer', ({ offer, to, from }) => {
        const targetSocketId = emailToSocketMaping.get(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('offer', { offer, from });
        }
    });

    socket.on('answer', ({ answer, to, from }) => {
        const targetSocketId = emailToSocketMaping.get(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('answer', { answer, from });
        }
    });

    socket.on('ice-candidate', ({ candidate, to }) => {
        const targetSocketId = emailToSocketMaping.get(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('ice-candidate', { candidate });
        }
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
    