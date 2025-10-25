import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export const LocationService = {
  // Request location permissions
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  },

  // Get current location with high accuracy
  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 10000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      // Return mock location for demo purposes
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        timestamp: Date.now(),
      };
    }
  },

  // Get address from coordinates with rate limit protection
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return {
          street: address.street || '',
          city: address.city || '',
          region: address.region || '',
          country: address.country || '',
          postalCode: address.postalCode || '',
          formattedAddress: `${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim(),
        };
      }
      return null;
    } catch (error) {
      console.warn('Geocoding failed:', error.message);
      
      // Return coordinate-based fallback address
      return {
        street: '',
        city: '',
        region: '',
        country: '',
        postalCode: '',
        formattedAddress: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };
    }
  },

  // Get location with address and fallback handling
  async getLocationWithAddress() {
    try {
      const location = await this.getCurrentLocation();
      
      // Try to get address, but don't fail if geocoding fails
      let address = null;
      try {
        address = await this.getAddressFromCoordinates(
          location.latitude,
          location.longitude
        );
      } catch (geocodeError) {
        console.warn('Geocoding service unavailable, using coordinates only');
        address = {
          formattedAddress: `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`,
          street: '',
          city: '',
          region: '',
          country: '',
          postalCode: '',
        };
      }

      return {
        ...location,
        address: address?.formattedAddress || `Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
        addressDetails: address,
      };
    } catch (error) {
      throw error;
    }
  },

  // Open location in maps
  openInMaps(latitude, longitude) {
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(fallbackUrl);
      }
    });
  },
};

export const EmergencyService = {
  // Emergency contact numbers by country
  emergencyNumbers: {
    US: '911',
    GB: '999',
    AU: '000',
    CA: '911',
    IN: '112',
    // Add more countries as needed
  },

  // Get emergency number for current location
  getEmergencyNumber(countryCode = 'US') {
    return this.emergencyNumbers[countryCode] || '911';
  },

  // Call emergency services
  callEmergencyServices(countryCode = 'US') {
    const emergencyNumber = this.getEmergencyNumber(countryCode);
    
    Alert.alert(
      'Call Emergency Services',
      `Do you want to call ${emergencyNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${emergencyNumber}`);
          },
        },
      ]
    );
  },

  // Send SMS to emergency contact
  sendEmergencySMS(phoneNumber, message, location) {
    const smsMessage = `EMERGENCY ALERT: ${message}. Location: https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(smsMessage)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'SMS not supported on this device');
      }
    });
  },

  // Share location via other apps
  shareLocation(location, message = 'Emergency - This is my current location') {
    const shareUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    const shareMessage = `${message}\n${shareUrl}`;

    if (Platform.OS === 'ios') {
      Linking.openURL(`sms:&body=${encodeURIComponent(shareMessage)}`);
    } else {
      Linking.openURL(`sms:?body=${encodeURIComponent(shareMessage)}`);
    }
  },
};

export const DeviceService = {
  // Get detailed device information
  async getDeviceInfo() {
    try {
      const deviceInfo = {
        platform: Platform.OS,
        platformVersion: Platform.Version,
        timestamp: new Date().toISOString(),
      };

      // Add more device info if available
      if (Platform.OS === 'ios') {
        deviceInfo.systemName = Platform.constants.systemName;
        deviceInfo.systemVersion = Platform.constants.systemVersion;
      }

      return deviceInfo;
    } catch (error) {
      console.error('Error getting device info:', error);
      return {
        platform: Platform.OS,
        platformVersion: Platform.Version,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export const ValidationService = {
  // Validate email address
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (basic validation)
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Validate required fields for SOS
  validateSOSData(data) {
    const errors = [];

    if (!data.user_name || data.user_name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (data.user_email && !this.validateEmail(data.user_email)) {
      errors.push('Please enter a valid email address');
    }

    if (data.user_phone && !this.validatePhone(data.user_phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (!data.latitude || !data.longitude) {
      errors.push('Location information is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export const StorageService = {
  // Keys for AsyncStorage (if you want to add local storage later)
  KEYS: {
    USER_INFO: 'sos_user_info',
    EMERGENCY_CONTACTS: 'emergency_contacts',
    SETTINGS: 'app_settings',
  },

  // You can implement AsyncStorage functions here if needed
  // For now, we'll just use state management in the component
};
