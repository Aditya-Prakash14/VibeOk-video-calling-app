import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const MapWidget = ({
  location,
  onMapPress,
  onMarkerPress,
  style,
  height = 200,
  showUserLocation = true,
  showMyLocationButton = true,
  markers = [],
}) => {
  const mapRef = React.useRef(null);

  const handleMapPress = (event) => {
    if (onMapPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMapPress(event);
    }
  };

  const handleMarkerPress = (marker) => {
    if (onMarkerPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onMarkerPress(marker);
    }
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  if (!location) {
    return (
      <View style={[styles.container, { height }, style]}>
        <LinearGradient
          colors={['#f0f0f0', '#e0e0e0']}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Loading location...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        onPress={handleMapPress}
        mapType="standard"
      >
        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          description="Current position"
          pinColor="#FF6B6B"
          onPress={() => handleMarkerPress({ type: 'user', location })}
        />
        
        {/* Additional markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.pinColor || '#007AFF'}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      
      {/* My Location Button */}
      {showMyLocationButton && (
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={centerOnUser}
        >
          <LinearGradient
            colors={['#007AFF', '#0051D5']}
            style={styles.myLocationGradient}
          >
            <Text style={styles.myLocationIcon}>📍</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      
      {/* Map overlay for coordinates */}
      <View style={styles.coordinatesOverlay}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={styles.coordinatesContainer}
        >
          <Text style={styles.coordinatesText}>
            📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  myLocationGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLocationIcon: {
    fontSize: 20,
  },
  coordinatesOverlay: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
  },
  coordinatesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  coordinatesText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MapWidget;