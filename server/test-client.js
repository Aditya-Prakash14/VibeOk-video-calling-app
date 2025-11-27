const io = require('socket.io-client');

const socket1 = io('http://localhost:8000');
const socket2 = io('http://localhost:8000');

const email1 = 'user1@example.com';
const email2 = 'user2@example.com';
const roomId = 'room1';

socket1.on('connect', () => {
    console.log('Socket 1 connected');
    socket1.emit('join-room', { roomId, emailId: email1 });
});

socket2.on('connect', () => {
    console.log('Socket 2 connected');
    socket2.emit('join-room', { roomId, emailId: email2 });
});

socket1.on('user-joined', ({ emailId }) => {
    console.log('User joined room:', emailId);
    if (emailId === email2) {
        console.log('Socket 1 sending offer to Socket 2');
        socket1.emit('offer', { offer: 'offer-sdp', to: email2, from: email1 });
    }
});

socket2.on('offer', ({ offer, from }) => {
    console.log('Socket 2 received offer from:', from);
    console.log('Socket 2 sending answer to Socket 1');
    socket2.emit('answer', { answer: 'answer-sdp', to: from, from: email2 });
});

socket1.on('answer', ({ answer, from }) => {
    console.log('Socket 1 received answer from:', from);
    console.log('Signaling test passed!');
    process.exit(0);
});

setTimeout(() => {
    console.log('Test timed out');
    process.exit(1);
}, 5000);
