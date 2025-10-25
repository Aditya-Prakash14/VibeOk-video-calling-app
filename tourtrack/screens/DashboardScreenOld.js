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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
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

  useEffect(() => {
    loadRecentAlerts();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await LocationService.getLocationWithAddress();
      setCurrentLocation(location);
    } catch (error) {
      console.warn('Could not get current location:', error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const loadRecentAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('sos_alerts')
        .select('*')
        .eq('tourist_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadRecentAlerts(),
      getCurrentLocation()
    ]);
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatAlertTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{profile?.first_name} {profile?.last_name}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Actions */}
      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.sosAction]}
            onPress={() => navigation.navigate('SOS')}
          >
            <Text style={styles.actionIcon}>🆘</Text>
            <Text style={styles.actionTitle}>Emergency SOS</Text>
            <Text style={styles.actionSubtitle}>Send alert with location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, styles.contactAction]}
            onPress={() => navigation.navigate('EmergencyContacts')}
          >
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionTitle}>Emergency Contacts</Text>
            <Text style={styles.actionSubtitle}>Manage contacts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, styles.locationAction]}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionTitle}>Share Location</Text>
            <Text style={styles.actionSubtitle}>Send to contacts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, styles.alertAction]}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionTitle}>Safety Alerts</Text>
            <Text style={styles.actionSubtitle}>Local warnings</Text>
          </TouchableOpacity>
        </View>
      </View>        {/* Current Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.locationCard}>
            {locationLoading ? (
              <Text style={styles.locationText}>Getting location...</Text>
            ) : currentLocation ? (
              <>
                <Text style={styles.locationText}>📍 {currentLocation.address}</Text>
                <Text style={styles.coordinatesText}>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </Text>
              </>
            ) : (
              <Text style={styles.locationText}>Location not available</Text>
            )}
            <TouchableOpacity
              style={styles.refreshLocationButton}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              <Text style={styles.refreshLocationText}>
                {locationLoading ? 'Updating...' : 'Refresh Location'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Travel Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, styles.statusSafe]} />
              <Text style={styles.statusText}>Safe & Secure</Text>
            </View>
            <TouchableOpacity
              style={styles.updateStatusButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.updateStatusText}>Update Travel Info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Emergency Alerts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AlertHistory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentAlerts.length > 0 ? (
            recentAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertType}>{alert.emergency_type}</Text>
                  <Text style={[
                    styles.alertStatus,
                    alert.is_resolved ? styles.alertResolved : styles.alertActive
                  ]}>
                    {alert.is_resolved ? 'Resolved' : 'Active'}
                  </Text>
                </View>
                <Text style={styles.alertTime}>{formatAlertTime(alert.created_at)}</Text>
                <Text style={styles.alertLocation}>{alert.address}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noAlertsCard}>
              <Text style={styles.noAlertsText}>No emergency alerts</Text>
              <Text style={styles.noAlertsSubtext}>You're all set! Stay safe while traveling.</Text>
            </View>
          )}
        </View>

        {/* Navigation Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Your Safety</Text>
          <View style={styles.navigationGrid}>
            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={styles.navTitle}>Profile</Text>
              <Text style={styles.navSubtitle}>Personal & travel info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate('EmergencyContacts')}
            >
              <Text style={styles.navIcon}>📞</Text>
              <Text style={styles.navTitle}>Emergency Contacts</Text>
              <Text style={styles.navSubtitle}>Manage contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate('TravelItinerary')}
            >
              <Text style={styles.navIcon}>🗺️</Text>
              <Text style={styles.navTitle}>Travel Itinerary</Text>
              <Text style={styles.navSubtitle}>Your travel plans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate('AlertHistory')}
            >
              <Text style={styles.navIcon}>📋</Text>
              <Text style={styles.navTitle}>Alert History</Text>
              <Text style={styles.navSubtitle}>Past emergency alerts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#ccc',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sosButton: {
    backgroundColor: '#FF6B6B',
  },
  checkInButton: {
    backgroundColor: '#4ECDC4',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  refreshLocationButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshLocationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  updateStatusButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateStatusText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  navCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navIcon: {
    fontSize: 32,
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
  },
});
