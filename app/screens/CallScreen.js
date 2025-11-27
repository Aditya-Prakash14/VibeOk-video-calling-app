import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebRTCService from '../services/WebRTCService';

const { width, height } = Dimensions.get('window');

export default function CallScreen({ route, navigation }) {
  const { calleeId, calleeName } = route.params;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [callStatus, setCallStatus] = useState('Calling...');
  
  const webrtcService = useRef(null);

  useEffect(() => {
    initializeCall();

    return () => {
      endCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');

      webrtcService.current = new WebRTCService();
      
      await webrtcService.current.initialize(userId, userName);
      
      webrtcService.current.on('localStream', (stream) => {
        setLocalStream(stream);
      });

      webrtcService.current.on('remoteStream', (stream) => {
        setRemoteStream(stream);
        setCallStatus('Connected');
      });

      webrtcService.current.on('callEnded', () => {
        handleEndCall();
      });

      await webrtcService.current.startCall(calleeId);
    } catch (error) {
      Alert.alert('Error', 'Failed to start call');
      navigation.goBack();
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeaker = () => {
    // Toggle speaker (implementation depends on react-native-webrtc version)
    setIsSpeakerOn(!isSpeakerOn);
  };

  const switchCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track._switchCamera();
      });
      setIsCameraFront(!isCameraFront);
    }
  };

  const handleEndCall = () => {
    endCall();
    navigation.goBack();
  };

  const endCall = () => {
    if (webrtcService.current) {
      webrtcService.current.endCall();
      webrtcService.current = null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Remote Video (Large) */}
      <View style={styles.remoteVideoContainer}>
        {remoteStream ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {calleeName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.calleeName}>{calleeName}</Text>
            <Text style={styles.callStatus}>{callStatus}</Text>
          </View>
        )}
      </View>

      {/* Local Video (Small) */}
      {localStream && (
        <View style={styles.localVideoContainer}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
            mirror={isCameraFront}
          />
        </View>
      )}

      {/* Call Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
          <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
          onPress={toggleSpeaker}
        >
          <Text style={styles.controlIcon}>{isSpeakerOn ? '🔊' : '🔇'}</Text>
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
          <Text style={styles.controlIcon}>🔄</Text>
          <Text style={styles.controlText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Text style={styles.controlIcon}>📞</Text>
          <Text style={styles.controlText}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  calleeName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: '#666',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  controlButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  endCallButton: {
    backgroundColor: '#dc2626',
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});
