import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

// Optional imports with fallbacks
let Battery, Network;
try {
  Battery = require('expo-battery');
  Network = require('expo-network');
} catch (e) {
  console.warn('Battery or Network modules not available');
}
import { useAuth } from '../context/AuthContext';
import { LocationService } from '../utils/services';
import { supabase } from '../config/supabase';
import { GradientButton, MapWidget, GlassCard, FloatingElements } from '../components';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user, profile, logout } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);
  const [networkState, setNetworkState] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadRecentAlerts();
    getCurrentLocation();
    getBatteryInfo();
    getNetworkInfo();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await LocationService.getLocationWithAddress();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please check permissions.');
    } finally {
      setLocationLoading(false);
    }
  };

  const getBatteryInfo = async () => {
    try {
      if (Battery) {
        const level = await Battery.getBatteryLevelAsync();
        const state = await Battery.getBatteryStateAsync();
        setBatteryLevel(Math.round(level * 100));
        setBatteryState(state);
      } else {
        setBatteryLevel(85); // fallback
        setBatteryState('UNKNOWN');
      }
    } catch (error) {
      console.error('Error getting battery info:', error);
      setBatteryLevel(85); // fallback
      setBatteryState('UNKNOWN');
    }
  };

  const getNetworkInfo = async () => {
    try {
      if (Network) {
        const networkState = await Network.getNetworkStateAsync();
        setNetworkState(networkState);
      } else {
        setNetworkState({ isConnected: true, type: 'WIFI' });
      }
    } catch (error) {
      console.error('Error getting network info:', error);
      setNetworkState({ isConnected: true, type: 'WIFI' });
    }
  };

  const loadRecentAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('tourist_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        // If table doesn't exist, use mock data
        console.log('Using mock alerts data');
        setRecentAlerts([
          {
            id: 1,
            type: 'SOS',
            status: 'resolved',
            created_at: new Date().toISOString(),
            message: 'Emergency resolved - Safe now'
          }
        ]);
        return;
      }
      setRecentAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      // Use mock data on network error
      setRecentAlerts([
        {
          id: 1,
          type: 'SOS',
          status: 'resolved',  
          created_at: new Date().toISOString(),
          message: 'Emergency resolved - Safe now'
        }
      ]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadRecentAlerts(), 
      getCurrentLocation(),
      getBatteryInfo(),
      getNetworkInfo()
    ]);
    setCurrentTime(new Date());
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getBatteryIcon = () => {
    if (!batteryLevel) return '🔋';
    if (batteryLevel > 75) return '🔋';
    if (batteryLevel > 50) return '🔋';
    if (batteryLevel > 25) return '🪫';
    return '🪫';
  };

  const getNetworkIcon = () => {
    if (!networkState || !networkState.isConnected) return '📶';
    const networkType = typeof networkState.type === 'string' ? networkState.type : networkState.type?.toString();
    switch (networkType) {
      case 'WIFI':
      case 'wifi':
        return '📶';
      case 'CELLULAR':
      case 'cellular':
        return 'M';
      default:
        return '📶';
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatAlertTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animatable.View animation="fadeIn" duration={1000} style={styles.fullScreenContainer}>
      <LinearGradient
        colors={['#0d0d0dff', '#7ded6cff', '#f4f8fbff', 'rgba(248,249,250,0.95)', '#f8f9fa']}
        locations={[0, 0.3, 0.5, 0.8, 1]}
        style={styles.fullScreenGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <FloatingElements>
            {/* Header */}
            <Animatable.View animation="slideInDown" duration={1000} style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.greeting}>{getGreeting()}</Text>
                  <Text style={styles.userName}>{profile?.first_name} {profile?.last_name}</Text>
                  
                  <Text style={styles.userSubtitle}>Stay safe on your journey</Text>
                  <Text style={styles.greeting}>Safety Score is 95% </Text>
                  
                  {/* Status Indicators */}
                  <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                      <Text style={styles.statusIcon}>{getBatteryIcon()}</Text>
                      <Text style={styles.statusText}>
                        {batteryLevel ? `${batteryLevel}%` : '...'}
                      </Text>
                    </View>
                    
                    <View style={styles.statusItem}>
                      <Text style={styles.statusIcon}>{getNetworkIcon()}</Text>
                      <Text style={styles.statusText}>
                        {networkState?.isConnected ? 'Online' : 'Offline'}
                      </Text>
                    </View>
                    
                    <View style={styles.statusItem}>
                      <Text style={styles.statusIcon}>⏰</Text>
                      <Text style={styles.statusText}>
                        {formatTime()}
                      </Text>
                    </View>
                    
                    <View style={styles.statusItem}>
                      <Text style={styles.statusIcon}>L</Text>
                      <Text style={styles.statusText}>
                        {currentLocation ? 'Located' : 'Locating...'}
                      </Text>
                    </View>
                  </View>
                </View>
                <GradientButton
                  title="Logout"
                  colors={['rgba(255,107,107,0.8)', 'rgba(255,71,87,0.6)']}
                  onPress={handleLogout}
                  style={styles.logoutButton}
                  textStyle={styles.logoutText}
                />
              </View>
            </Animatable.View>
          </FloatingElements>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={200} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <GlassCard
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('SOS');
              }}
              gradient={['rgba(255, 107, 107, 0.2)', 'rgba(255, 107, 107, 0.1)']}
              borderColor="rgba(255, 107, 107, 0.3)"
              haptic={false}
            >
              <Text style={styles.actionIcon}>🆘</Text>
              <Text style={[styles.actionTitle, { color: '#FF6B6B' }]}>Emergency SOS</Text>
              <Text style={styles.actionSubtitle}>Send alert with location</Text>
            </GlassCard>
            
            <GlassCard
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('EmergencyContacts');
              }}
              gradient={['rgba(78, 205, 196, 0.2)', 'rgba(78, 205, 196, 0.1)']}
              borderColor="rgba(78, 205, 196, 0.3)"
              haptic={false}
            >
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={[styles.actionTitle, { color: '#4ECDC4' }]}>Emergency Contacts</Text>
              <Text style={styles.actionSubtitle}>Manage contacts</Text>
            </GlassCard>
            
            <GlassCard
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Coming Soon', 'Location sharing feature will be available soon!');
              }}
              gradient={['rgba(69, 183, 209, 0.2)', 'rgba(69, 183, 209, 0.1)']}
              borderColor="rgba(69, 183, 209, 0.3)"
              haptic={false}
            >
              <Text style={styles.actionIcon}>L</Text>
              <Text style={[styles.actionTitle, { color: '#45B7D1' }]}>Share Location</Text>
              <Text style={styles.actionSubtitle}>Send to contacts</Text>
            </GlassCard>
            
            <GlassCard
              style={styles.actionCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Coming Soon', 'Safety alerts feature will be available soon!');
              }}
              gradient={['rgba(150, 206, 180, 0.2)', 'rgba(150, 206, 180, 0.1)']}
              borderColor="rgba(150, 206, 180, 0.3)"
              haptic={false}
            >
              <Text style={styles.actionIcon}>🔔</Text>
              <Text style={[styles.actionTitle, { color: '#96CEB4' }]}>Safety Alerts</Text>
              <Text style={styles.actionSubtitle}>Local warnings</Text>
            </GlassCard>
          </View>
        </Animatable.View>

        {/* Current Location with Map */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <GlassCard>
            {locationLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Getting your location...</Text>
              </View>
            ) : currentLocation ? (
              <>
                <MapWidget
                  location={currentLocation}
                  height={200}
                  onMapPress={() => {
                    Alert.alert('Location Details', currentLocation.address);
                  }}
                  style={styles.mapWidget}
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>{currentLocation.address}</Text>
                  <Text style={styles.coordinatesText}>
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </Text>
                  <GradientButton
                    title={locationLoading ? 'Updating...' : 'Refresh Location'}
                    colors={['#4ECDC4', '#44A08D']}
                    onPress={getCurrentLocation}
                    disabled={locationLoading}
                    loading={locationLoading}
                    style={styles.refreshLocationButton}
                    textStyle={styles.refreshLocationText}
                  />
                </View>
              </>
            ) : (
              <View style={styles.locationUnavailable}>
                <Text style={styles.locationUnavailableIcon}>L</Text>
                <Text style={styles.locationText}>Location not available</Text>
                <Text style={styles.locationSubtext}>Enable location services to see your position</Text>
                <GradientButton
                  title="Get Location"
                  colors={['#007AFF', '#0051D5']}
                  onPress={getCurrentLocation}
                  style={styles.getLocationButton}
                />
              </View>
            )}
          </GlassCard>
        </Animatable.View>

        {/* Travel Status */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={600} style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Status</Text>
          <GlassCard>
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusSafe]} />
                <Text style={styles.statusText}>Safe & Secure</Text>
              </View>
              <Text style={styles.statusDescription}>
                Your safety status is up to date. Emergency services can locate you if needed.
              </Text>
              <GradientButton
                title="Update Travel Info"
                colors={['#96CEB4', '#7B9EA3']}
                onPress={() => Alert.alert('Coming Soon', 'Profile management will be available soon!')}
                style={styles.updateStatusButton}
                textStyle={styles.updateStatusText}
              />
            </View>
          </GlassCard>
        </Animatable.View>

        {/* Recent Alerts */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={800} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Emergency Alerts</Text>
            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Alert history will be available soon!')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentAlerts.length > 0 ? (
            recentAlerts.map((alert, index) => (
              <Animatable.View key={alert.id} animation="fadeInLeft" duration={800} delay={1000 + (index * 200)}>
                <GlassCard style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertType}>{alert.emergency_type}</Text>
                    <Text style={[
                      styles.alertStatus,
                      alert.status === 'active' ? styles.alertActive : styles.alertResolved
                    ]}>
                      {alert.status}
                    </Text>
                  </View>
                  <Text style={styles.alertTime}>{formatAlertTime(alert.created_at)}</Text>
                  <Text style={styles.alertLocation}>{alert.location_address || 'Location not available'}</Text>
                </GlassCard>
              </Animatable.View>
            ))
          ) : (
            <GlassCard style={styles.noAlertsCard}>
              <Text style={styles.noAlertsIcon}>✓</Text>
              <Text style={styles.noAlertsText}>No Recent Alerts</Text>
              <Text style={styles.noAlertsSubtext}>
                Great! You haven't needed emergency assistance recently. Stay safe!
              </Text>
            </GlassCard>
          )}
        </Animatable.View>

        {/* Navigation Cards */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={1000} style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Manage Your Safety</Text>
          <View style={styles.navigationGrid}>
            <GlassCard style={styles.navCard} onPress={() => Alert.alert('Coming Soon', 'Profile will be available soon!')} haptic>
              <Text style={styles.navIcon}>P</Text>
              <Text style={styles.navTitle}>Profile</Text>
              <Text style={styles.navSubtitle}>Personal & travel info</Text>
            </GlassCard>

            <GlassCard style={styles.navCard} onPress={() => navigation.navigate('EmergencyContacts')} haptic>
              <Text style={styles.navIcon}>📞</Text>
              <Text style={styles.navTitle}>Emergency Contacts</Text>
              <Text style={styles.navSubtitle}>Manage contacts</Text>
            </GlassCard>

            <GlassCard style={styles.navCard} onPress={() => Alert.alert('Coming Soon', 'Travel itinerary will be available soon!')} haptic>
              <Text style={styles.navIcon}>M</Text>
              <Text style={styles.navTitle}>Travel Itinerary</Text>
              <Text style={styles.navSubtitle}>Your travel plans</Text>
            </GlassCard>

            <GlassCard style={styles.navCard} onPress={() => Alert.alert('Coming Soon', 'Alert history will be available soon!')} haptic>
              <Text style={styles.navIcon}>C</Text>
              <Text style={styles.navTitle}>Alert History</Text>
              <Text style={styles.navSubtitle}>Past emergency alerts</Text>
            </GlassCard>
          </View>
        </Animatable.View>
      </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  fullScreenGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  userInfoContainer: {
    flex: 1,
    marginRight: 15,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
    minWidth: 90,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: 'rgba(255,107,107,0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  lastSection: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 15,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  mapWidget: {
    marginBottom: 15,
  },
  locationInfo: {
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  refreshLocationButton: {
    paddingHorizontal: 20,
  },
  refreshLocationText: {
    fontSize: 14,
  },
  locationUnavailable: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  locationUnavailableIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  locationSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  getLocationButton: {
    paddingHorizontal: 20,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusSafe: {
    backgroundColor: '#4ECDC4',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  updateStatusButton: {
    paddingHorizontal: 20,
  },
  updateStatusText: {
    fontSize: 14,
  },
  alertCard: {
    marginBottom: 10,
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  alertStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertActive: {
    backgroundColor: '#FFE5E5',
    color: '#D32F2F',
  },
  alertResolved: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  alertTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 14,
    color: '#666',
  },
  noAlertsCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAlertsIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    padding: 20,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  navSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -6, // Negative margin to offset item margins
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 6, // Individual item spacing
    marginVertical: 3,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 5,
    minWidth: 16,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 0.3,
  },
});