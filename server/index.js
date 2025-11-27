require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/auth', authRoutes);

const emailToSocketMaping = new Map();
const socketToEmailMaping = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', data => {
        const { roomId, emailId } = data;
        console.log('User joined room with data:', emailId, 'Joining Room:', roomId);
        emailToSocketMaping.set(emailId, socket.id);
        socketToEmailMaping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit('joined-room', { roomId });
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

    socket.on('disconnect', () => {
        const email = socketToEmailMaping.get(socket.id);
        if (email) {
            emailToSocketMaping.delete(email);
            socketToEmailMaping.delete(socket.id);
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
