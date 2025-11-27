import { Alert, Platform } from 'react-native';

let WebRTC = {
    RTCView: () => null,
    mediaDevices: {
        getUserMedia: async () => {
            Alert.alert('Error', 'Video calling requires a native build. It does not work in Expo Go.');
            throw new Error('WebRTC not supported in Expo Go');
        }
    },
    RTCPeerConnection: class {
        constructor() {
            console.warn('RTCPeerConnection is mocked');
        }
        addTrack() { }
        createOffer() { return Promise.resolve({}); }
        setLocalDescription() { return Promise.resolve(); }
        setRemoteDescription() { return Promise.resolve(); }
        createAnswer() { return Promise.resolve({}); }
        addIceCandidate() { return Promise.resolve(); }
        close() { }
    },
    RTCSessionDescription: class { },
    RTCIceCandidate: class { },
};

try {
    // Attempt to load the real module
    // This will fail in Expo Go because the native module is missing
    const RealWebRTC = require('react-native-webrtc');
    if (RealWebRTC) {
        WebRTC = RealWebRTC;
    }
} catch (e) {
    console.log('WebRTC native module not found. Using mock.');
}

export const {
    RTCView,
    mediaDevices,
    RTCPeerConnection,
    RTCSessionDescription,
    RTCIceCandidate,
} = WebRTC;
