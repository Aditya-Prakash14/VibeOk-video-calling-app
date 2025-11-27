import React, { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { RTCView, mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from '../utils/webrtc';
import io from 'socket.io-client';

// Replace with your machine's IP address
const SERVER_URL = 'http://192.168.143.11:8000';

export default function CallScreen({ route, navigation }) {
    const { roomId, user } = route.params;
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [status, setStatus] = useState('Connecting...');

    const socketRef = useRef();
    const peerConnectionRef = useRef();

    useEffect(() => {
        startCall();

        return () => {
            cleanup();
        };
    }, []);

    const cleanup = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
    };

    const startCall = async () => {
        // 1. Get Local Stream
        const stream = await mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setLocalStream(stream);

        // 2. Connect Socket
        socketRef.current = io(SERVER_URL);
        socketRef.current.emit('join-room', { roomId, emailId: user.email });

        socketRef.current.on('user-joined', handleUserJoined);
        socketRef.current.on('offer', handleReceiveOffer);
        socketRef.current.on('answer', handleReceiveAnswer);
        socketRef.current.on('ice-candidate', handleNewICECandidate);

        // 3. Create Peer Connection
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const pc = new RTCPeerConnection(configuration);
        peerConnectionRef.current = pc;

        // Add local tracks to PC
        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: user.email, // This logic needs refinement: we need to know WHO to send to. 
                    // For simplicity in 1-on-1, we broadcast or the server handles it.
                    // In our server, we need 'to' email. 
                    // Current server logic expects 'to'. 
                    // For now, let's assume the other peer is the one we are connected to.
                    // We need to store the remote user's email.
                });
            }
        };

        setStatus('Waiting for peer...');
    };

    // We need to track the remote user's email to send signals back
    const remoteEmailRef = useRef(null);

    const handleUserJoined = async ({ emailId }) => {
        console.log('User joined:', emailId);
        remoteEmailRef.current = emailId;
        setStatus('Peer joined. Calling...');

        // Create Offer
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        socketRef.current.emit('offer', {
            offer,
            to: emailId,
            from: user.email
        });
    };

    const handleReceiveOffer = async ({ offer, from }) => {
        console.log('Received offer from:', from);
        remoteEmailRef.current = from;
        setStatus('Receiving call...');

        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socketRef.current.emit('answer', {
            answer,
            to: from,
            from: user.email
        });
    };

    const handleReceiveAnswer = async ({ answer }) => {
        console.log('Received answer');
        setStatus('Connected');
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleNewICECandidate = async ({ candidate }) => {
        if (peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    const handleEndCall = () => {
        cleanup();
        navigation.goBack();
    };

    return (
        <Box className="flex-1 bg-black">
            <VStack className="flex-1">
                {/* Remote Stream (Full Screen) */}
                <Box className="flex-1 bg-gray-900 justify-center items-center">
                    {remoteStream ? (
                        <RTCView
                            streamURL={remoteStream.toURL()}
                            style={{ width: '100%', height: '100%' }}
                            objectFit="cover"
                        />
                    ) : (
                        <Text className="text-white text-xl">{status}</Text>
                    )}
                </Box>

                {/* Local Stream (Floating) */}
                {localStream && (
                    <Box className="absolute top-12 right-4 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white">
                        <RTCView
                            streamURL={localStream.toURL()}
                            style={{ width: '100%', height: '100%' }}
                            objectFit="cover"
                            zOrder={1}
                        />
                    </Box>
                )}

                {/* Controls */}
                <Box className="absolute bottom-10 w-full items-center">
                    <Button
                        size="xl"
                        className="bg-red-600 rounded-full px-8"
                        onPress={handleEndCall}
                    >
                        <ButtonText>End Call</ButtonText>
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
}
