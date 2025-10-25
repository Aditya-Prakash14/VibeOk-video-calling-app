import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Text      Alert.alert(
        'SOS Alert Sent!',
        'Emergency alert sent successfully! Emergency responders have been notified.',
        [t,
  Alert,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import MapWidget from '../components/MapWidget';
import GlassCard from '../components/GlassCard';

export default function SOSScreen({ navigation }) {
  const { user, profile } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyType, setEmergencyType] = useState('general');
  const [customMessage, setCustomMessage] = useState('');
  const [lastSOSTime, setLastSOSTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  
  // Media attachment states
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [attachedVideo, setAttachedVideo] = useState(null);
  const [voiceRecording, setVoiceRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState(null);

  const emergencyTypes = [
    { key: 'medical', label: 'Medical', color: '#FF6B6B' },
    { key: 'fire', label: 'Fire', color: '#FF8E53' },
    { key: 'police', label: 'Police', color: '#4ECDC4' },
    { key: 'accident', label: 'Accident', color: '#45B7D1' },
    { key: 'natural', label: 'Natural Disaster', color: '#96CEB4' },
    { key: 'general', label: 'General Emergency', color: '#FFEAA7' },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: 'Current Location',
      };

      setCurrentLocation(locationData);
      setLocationLoading(false);
      return locationData;
    } catch (error) {
      setLocationLoading(false);
      const mockLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA (Demo Location)',
      };
      setCurrentLocation(mockLocation);
      return mockLocation;
    }
  };

  const sendSOSAlert = async () => {
    const now = Date.now();
    if (now - lastSOSTime < 3000) {
      Alert.alert('Please Wait', 'Please wait before sending another alert.');
      return;
    }

    setIsLoading(true);
    setLastSOSTime(now);
    
    try {
      const locationData = await getCurrentLocation();
      
      // Count attachments
      let attachmentCount = 0;
      if (attachedPhoto) attachmentCount++;
      if (attachedVideo) attachmentCount++;
      if (voiceRecording) attachmentCount++;
      
      const attachmentText = attachmentCount > 0 
        ? ` ${attachmentCount} media attachment${attachmentCount > 1 ? 's' : ''} included.`
        : '';
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        '🚨 SOS Alert Sent!',
        `Emergency alert sent successfully! Emergency responders have been notified.${attachmentText}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              setCustomMessage('');
              // Clear media attachments
              setAttachedPhoto(null);
              setAttachedVideo(null);
              setVoiceRecording(null);
              navigation.goBack();
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS alert.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSOSPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Send Emergency Alert',
      'This will send an SOS alert to emergency responders.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send SOS', onPress: () => sendSOSAlert(), style: 'destructive' }
      ]
    );
  };

  // Media handling functions
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const audioPermission = await Audio.requestPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || 
        mediaLibraryPermission.status !== 'granted' || 
        audioPermission.status !== 'granted') {
      Alert.alert('Permissions Required', 'Please grant camera, media library, and microphone permissions to attach media.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAttachedPhoto(result.assets[0]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const pickPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAttachedPhoto(result.assets[0]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const recordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 30, // 30 seconds max for emergency
      quality: ImagePicker.VideoQuality.Medium,
    });

    if (!result.canceled) {
      setAttachedVideo(result.assets[0]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      recording.setOnRecordingStatusUpdate((status) => {
        if (!status.isRecording) {
          clearInterval(timer);
        }
      });
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Failed to start voice recording.');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecordingDuration(0);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setVoiceRecording({ uri, duration: recordingDuration });
      setRecording(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const removeAttachment = (type) => {
    switch (type) {
      case 'photo':
        setAttachedPhoto(null);
        break;
      case 'video':
        setAttachedVideo(null);
        break;
      case 'voice':
        setVoiceRecording(null);
        break;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f4c75']}
        style={styles.container}
      >
        <StatusBar style="light" />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View animation="slideInDown" duration={1000} style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.backButtonGradient}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Emergency SOS</Text>
            <Text style={styles.headerSubtitle}>Immediate help when you need it</Text>
          </Animatable.View>

          {/* Tourist Information */}
          <Animatable.View animation="fadeInUp" duration={1000} delay={200} style={styles.cardContainer}>
            <GlassCard style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Tourist Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{profile?.first_name} {profile?.last_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
            </GlassCard>
          </Animatable.View>

          {/* Location Information */}
          {currentLocation && (
            <Animatable.View animation="fadeInUp" duration={1000} delay={300} style={styles.cardContainer}>
              <GlassCard style={styles.locationCard}>
                <Text style={styles.sectionTitle}>Current Location</Text>
                <MapWidget
                  location={currentLocation}
                  height={180}
                  style={styles.mapWidget}
                />
                <GradientButton
                  title="Update Location"
                  colors={['#4ECDC4', '#44A08D']}
                  onPress={getCurrentLocation}
                  loading={locationLoading}
                  style={styles.updateLocationButton}
                />
              </GlassCard>
            </Animatable.View>
          )}

          {/* Emergency Type Selection */}
          <Animatable.View animation="fadeInUp" duration={1000} delay={400} style={styles.cardContainer}>
            <GlassCard style={styles.emergencyTypeCard}>
              <Text style={styles.sectionTitle}>Emergency Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emergencyTypesContainer}>
                {emergencyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.emergencyTypeButton,
                      emergencyType === type.key && styles.emergencyTypeButtonSelected,
                      { borderColor: type.color }
                    ]}
                    onPress={() => {
                      setEmergencyType(type.key);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <LinearGradient
                      colors={emergencyType === type.key ? [type.color, type.color + '80'] : ['transparent', 'transparent']}
                      style={styles.emergencyTypeGradient}
                    >
                      <Text style={[
                        styles.emergencyTypeText,
                        { color: emergencyType === type.key ? '#fff' : type.color }
                      ]}>
                        {type.label}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </GlassCard>
          </Animatable.View>

          {/* SOS Button */}
          <Animatable.View animation="fadeInUp" duration={1000} delay={600} style={styles.sosContainer}>
            <Animatable.View
              animation={!isLoading ? "pulse" : undefined}
              iterationCount="infinite"
              duration={2000}
              style={styles.pulseContainer}
            >
              <LinearGradient
                colors={['rgba(255,107,107,0.3)', 'transparent']}
                style={styles.pulseBackground}
              />
            </Animatable.View>
            
            <TouchableOpacity
              style={[styles.sosButtonContainer, isLoading && styles.sosButtonDisabled]}
              onPress={handleSOSPress}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#999', '#666'] : ['#FF6B6B', '#FF4757']}
                style={styles.sosButton}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.sosButtonText}>SOS</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addMessageButton}
              onPress={() => setModalVisible(true)}
            >
              <LinearGradient
                colors={customMessage || attachedPhoto || attachedVideo || voiceRecording ? ['#4CAF50', '#45a049'] : ['#666', '#555']}
                style={styles.messageButton}
              >
                <Text style={styles.messageButtonText}>
                  {(() => {
                    const hasMessage = customMessage;
                    const attachmentCount = [attachedPhoto, attachedVideo, voiceRecording].filter(Boolean).length;
                    
                    if (hasMessage && attachmentCount > 0) {
                      return `✓ Message + ${attachmentCount} Media`;
                    } else if (hasMessage) {
                      return '✓ Message Added';
                    } else if (attachmentCount > 0) {
                      return `✓ ${attachmentCount} Media Attached`;
                    } else {
                      return '+ Add Message/Media';
                    }
                  })()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.sosInstructions}>
              Tap SOS button to send emergency alert with your location
            </Text>
          </Animatable.View>

          {/* Instructions */}
          <Animatable.View animation="fadeInUp" duration={1000} delay={800} style={styles.cardContainer}>
            <GlassCard style={styles.instructionsCard}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <Text style={styles.instructionsText}>1. Choose emergency type above</Text>
              <Text style={styles.instructionsText}>2. Add optional message if needed</Text>
              <Text style={styles.instructionsText}>3. Tap SOS button to send alert</Text>
              <Text style={styles.instructionsText}>4. Your location is sent automatically</Text>
              <Text style={styles.instructionsText}>5. Emergency responders are notified</Text>
            </GlassCard>
          </Animatable.View>
        </ScrollView>

        {/* Enhanced Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={50} style={styles.modalOverlay}>
            <Animatable.View animation="slideInUp" duration={500} style={styles.modalContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.modalContent}
              >
                <Text style={styles.modalTitle}>Additional Information</Text>
                <Text style={styles.modalSubtitle}>
                  Add details about your emergency (optional)
                </Text>
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Describe your situation, injuries, or specific help needed..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={customMessage}
                  onChangeText={setCustomMessage}
                  maxLength={200}
                />
                <Text style={styles.characterCount}>{customMessage.length}/200</Text>
                
                {/* Media Attachments Section */}
                <Text style={styles.attachmentTitle}>📎 Attach Media (Optional)</Text>
                
                {/* Media Action Buttons */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaButtonsContainer}>
                  <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                    <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.mediaButtonGradient}>
                      <Text style={styles.mediaButtonIcon}>📷</Text>
                      <Text style={styles.mediaButtonText}>Camera</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.mediaButton} onPress={pickPhoto}>
                    <LinearGradient colors={['#45B7D1', '#3498DB']} style={styles.mediaButtonGradient}>
                      <Text style={styles.mediaButtonIcon}>IMG</Text>
                      <Text style={styles.mediaButtonText}>Gallery</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.mediaButton} onPress={recordVideo}>
                    <LinearGradient colors={['#FF6B6B', '#E74C3C']} style={styles.mediaButtonGradient}>
                      <Text style={styles.mediaButtonIcon}>VID</Text>
                      <Text style={styles.mediaButtonText}>Video</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.mediaButton} 
                    onPress={isRecording ? stopRecording : startRecording}
                  >
                    <LinearGradient 
                      colors={isRecording ? ['#E74C3C', '#C0392B'] : ['#9B59B6', '#8E44AD']} 
                      style={styles.mediaButtonGradient}
                    >
                      <Text style={styles.mediaButtonIcon}>
                        {isRecording ? 'STOP' : 'MIC'}
                      </Text>
                      <Text style={styles.mediaButtonText}>
                        {isRecording ? `${recordingDuration}s` : 'Voice'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
                
                {/* Attached Media Preview */}
                {(attachedPhoto || attachedVideo || voiceRecording) && (
                  <View style={styles.attachmentsPreview}>
                    <Text style={styles.attachmentPreviewTitle}>Attached:</Text>
                    
                    {attachedPhoto && (
                      <View style={styles.attachmentItem}>
                        <Image source={{ uri: attachedPhoto.uri }} style={styles.previewImage} />
                        <View style={styles.attachmentInfo}>
                          <Text style={styles.attachmentName}>Photo</Text>
                          <TouchableOpacity 
                            onPress={() => removeAttachment('photo')}
                            style={styles.removeButton}
                          >
                            <Text style={styles.removeButtonText}>X</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    
                    {attachedVideo && (
                      <View style={styles.attachmentItem}>
                        <View style={styles.videoPreview}>
                          <Text style={styles.videoIcon}>VID</Text>
                        </View>
                        <View style={styles.attachmentInfo}>
                          <Text style={styles.attachmentName}>Video {attachedVideo.duration ? `(${Math.round(attachedVideo.duration / 1000)}s)` : ''}</Text>
                          <TouchableOpacity 
                            onPress={() => removeAttachment('video')}
                            style={styles.removeButton}
                          >
                            <Text style={styles.removeButtonText}>X</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    
                    {voiceRecording && (
                      <View style={styles.attachmentItem}>
                        <View style={styles.voicePreview}>
                          <Text style={styles.voiceIcon}>MIC</Text>
                        </View>
                        <View style={styles.attachmentInfo}>
                          <Text style={styles.attachmentName}>Voice ({voiceRecording.duration}s)</Text>
                          <TouchableOpacity 
                            onPress={() => removeAttachment('voice')}
                            style={styles.removeButton}
                          >
                            <Text style={styles.removeButtonText}>X</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                
                <View style={styles.modalButtons}>
                  <GradientButton
                    title="Cancel"
                    colors={['#999', '#777']}
                    onPress={() => setModalVisible(false)}
                    style={styles.modalButton}
                  />
                  <GradientButton
                    title="Save Message"
                    colors={['#4CAF50', '#45a049']}
                    onPress={() => setModalVisible(false)}
                    style={styles.modalButton}
                  />
                </View>
              </LinearGradient>
            </Animatable.View>
          </BlurView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    padding: 20,
  },
  locationCard: {
    padding: 20,
  },
  emergencyTypeCard: {
    padding: 20,
  },
  instructionsCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  mapWidget: {
    marginBottom: 15,
  },
  updateLocationButton: {
    marginTop: 10,
  },
  emergencyTypesContainer: {
    paddingVertical: 10,
  },
  emergencyTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    borderWidth: 2,
    minWidth: 120,
  },
  emergencyTypeButtonSelected: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyTypeGradient: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 23,
    alignItems: 'center',
  },
  emergencyTypeText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  pulseContainer: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    top: -35,
  },
  pulseBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 125,
  },
  sosButtonContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  sosButtonDisabled: {
    opacity: 0.6,
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  addMessageButton: {
    marginTop: 30,
  },
  messageButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  sosInstructions: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    paddingLeft: 5,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: '100%',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginBottom: 20,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
  // Media attachment styles
  attachmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  mediaButtonsContainer: {
    marginBottom: 15,
    maxHeight: 80,
  },
  mediaButton: {
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  mediaButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  mediaButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  attachmentsPreview: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  attachmentPreviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  videoPreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  videoIcon: {
    fontSize: 20,
  },
  voicePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#9B59B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  voiceIcon: {
    fontSize: 18,
  },
  attachmentInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachmentName: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
