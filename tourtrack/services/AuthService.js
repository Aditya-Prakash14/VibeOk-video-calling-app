import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, DEMO_USER, DEMO_CREDENTIALS } from '../config/supabase';

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  // Demo login - checks against predefined credentials
  async login(email, password) {
    try {
      console.log('Login attempt:', email, password);
      
      // Check demo credentials
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        console.log('Demo credentials matched, logging in demo user');
        
        // Use local demo user data
        await AsyncStorage.setItem('userSession', JSON.stringify(DEMO_USER));
        this.currentUser = DEMO_USER;
        return { success: true, user: DEMO_USER };
      }

      // For other users, you could implement database lookup here
      console.log('Not demo credentials, checking database...');
      
      // Simple database check (optional for demo)
      const { data: tourists, error } = await supabase
        .from('tourists')
        .select('*')
        .eq('email', email);

      if (error) {
        console.error('Database error:', error);
        return { success: false, error: 'Invalid credentials' };
      }

      if (!tourists || tourists.length === 0) {
        return { success: false, error: 'Invalid credentials - user not found' };
      }

      const tourist = tourists[0];
      
      // Store user session
      await AsyncStorage.setItem('userSession', JSON.stringify(tourist));
      this.currentUser = tourist;
      return { success: true, user: tourist };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register new tourist
  async register(userData) {
    try {
      // Generate unique ID
      const userId = `tourist-${Date.now()}`;
      
      const touristData = {
        id: userId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        nationality: userData.nationality,
        passport_number: userData.passportNumber,
        emergency_contact_name: userData.emergencyContactName,
        emergency_contact_phone: userData.emergencyContactPhone,
        emergency_contact_relationship: userData.emergencyContactRelationship
      };

      // Insert into tourists table
      const { data, error } = await supabase
        .from('tourists')
        .insert([touristData])
        .select();

      if (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }

      const newUser = data[0];
      
      // Store user session
      await AsyncStorage.setItem('userSession', JSON.stringify(newUser));
      this.currentUser = newUser;
      return { success: true, user: newUser };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is logged in
  async getCurrentUser() {
    try {
      if (this.currentUser) {
        return this.currentUser;
      }

      const sessionData = await AsyncStorage.getItem('userSession');
      if (sessionData) {
        this.currentUser = JSON.parse(sessionData);
        return this.currentUser;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await AsyncStorage.removeItem('userSession');
      this.currentUser = null;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // For demo user, just update locally
      if (this.currentUser.id === DEMO_USER.id) {
        this.currentUser = { ...this.currentUser, ...updates };
        await AsyncStorage.setItem('userSession', JSON.stringify(this.currentUser));
        return { success: true, user: this.currentUser };
      }

      // For other users, update in database
      const { data, error } = await supabase
        .from('tourists')
        .update(updates)
        .eq('id', this.currentUser.id)
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update stored session
      this.currentUser = { ...this.currentUser, ...data[0] };
      await AsyncStorage.setItem('userSession', JSON.stringify(this.currentUser));
      
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();
