import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.userId = null;
    this.calleeId = null;
    this.eventHandlers = {};
  }

  on(event, handler) {
    this.eventHandlers[event] = handler;
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event](data);
    }
  }

  async initialize(userId, userName) {
    this.userId = userId;

    // Connect to socket
    this.socket = io(SOCKET_URL);

    this.socket.emit('register', { userId, userName });

    // Get local media stream
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: 'user',
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
        },
      });

      this.localStream = stream;
      this.emit('localStream', stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }

    // Setup socket listeners
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('call-made', async (data) => {
      await this.handleCallMade(data);
    });

    this.socket.on('answer-made', async (data) => {
      await this.handleAnswerMade(data);
    });

    this.socket.on('ice-candidate', async (data) => {
      await this.handleIceCandidate(data);
    });

    this.socket.on('call-ended', () => {
      this.emit('callEnded');
    });
  }

  async startCall(calleeId) {
    this.calleeId = calleeId;

    // Create peer connection
    this.peerConnection = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.emit('remoteStream', event.streams[0]);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          to: this.calleeId,
          candidate: event.candidate,
        });
      }
    };

    // Create offer
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit('make-call', {
        to: this.calleeId,
        offer,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async handleCallMade(data) {
    const { from, offer } = data;
    this.calleeId = from;

    // Create peer connection
    this.peerConnection = new RTCPeerConnection(configuration);

    // Add local stream
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.emit('remoteStream', event.streams[0]);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          to: this.calleeId,
          candidate: event.candidate,
        });
      }
    };

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('make-answer', {
        to: this.calleeId,
        answer,
      });
    } catch (error) {
      console.error('Error handling call:', error);
    }
  }

  async handleAnswerMade(data) {
    const { answer } = data;

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  async handleIceCandidate(data) {
    const { candidate } = data;

    try {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  endCall() {
    if (this.socket) {
      this.socket.emit('end-call', { to: this.calleeId });
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.remoteStream = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default WebRTCService;
