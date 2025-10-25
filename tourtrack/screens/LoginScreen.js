import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { GradientButton, GlassCard, FloatingElements } from '../components';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      // Login successful, navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@tourist.com');
    setPassword('demo123');
    // Auto-login with demo credentials
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }
    
    navigation.navigate('ForgotPassword', { email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f4c75']}
          style={styles.gradient}
        >
          <FloatingElements>
          <KeyboardAvoidingView 
            style={styles.keyboardContainer} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Logo/Header */}
              <Animatable.View animation="fadeInDown" duration={1500} style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                  <Animatable.Text animation="bounceIn" duration={2000} delay={500} style={styles.logoIcon}>T</Animatable.Text>
                  <Animatable.Text animation="slideInUp" duration={1500} delay={800} style={styles.appName}>TourGuard</Animatable.Text>
                  <Animatable.Text animation="fadeIn" duration={2000} delay={1200} style={styles.tagline}>Your Travel Safety Companion</Animatable.Text>
                </View>
              </Animatable.View>

              {/* Demo Info Card */}
              <Animatable.View animation="slideInLeft" duration={1000} delay={1500}>
                <GlassCard
                  style={styles.demoCard}
                  gradient={['rgba(33, 150, 243, 0.2)', 'rgba(33, 150, 243, 0.1)']}
                  borderColor="rgba(33, 150, 243, 0.3)"
                >
                  <Text style={styles.demoTitle}>🚀 Demo Access</Text>
                  <Text style={styles.demoText}>Email: demo@tourist.com</Text>
                  <Text style={styles.demoText}>Password: demo123</Text>
                  <GradientButton
                    title="Quick Demo Login"
                    colors={['#4CAF50', '#45A049']}
                    onPress={handleDemoLogin}
                    disabled={isLoading}
                    style={styles.quickDemoButton}
                    textStyle={styles.quickDemoText}
                  />
                </GlassCard>
              </Animatable.View>

              {/* Login Form */}
              <Animatable.View animation="fadeInUp" duration={1000} delay={1800} style={styles.formContainer}>
                <GlassCard
                  gradient={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
                  borderColor="rgba(255,255,255,0.2)"
                >
                  <Text style={styles.welcomeText}>Welcome Back</Text>
                  <Text style={styles.subtitleText}>Sign in to your account</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>📧 Email Address</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          clearError();
                        }}
                        placeholder="Enter your email"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🔒 Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          clearError();
                        }}
                        placeholder="Enter your password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.forgotPasswordButton}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <GradientButton
                    title={isLoading ? 'Signing In...' : 'Sign In'}
                    colors={['#007AFF', '#0051D5']}
                    onPress={handleLogin}
                    disabled={isLoading}
                    loading={isLoading}
                    style={styles.loginButton}
                  />

                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.divider} />
                  </View>

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('Register');
                    }}
                  >
                    <Text style={styles.registerButtonText}>
                      Don't have an account? <Text style={styles.registerButtonHighlight}>Sign Up</Text>
                    </Text>
                  </TouchableOpacity>
                </GlassCard>
              </Animatable.View>

              {/* Features */}
              <Animatable.View animation="fadeInUp" duration={1000} delay={2200} style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Travel with Confidence</Text>
                <View style={styles.featuresList}>
                  <GlassCard style={styles.featureCard} gradient={['rgba(255, 107, 107, 0.15)', 'rgba(255, 107, 107, 0.08)']} borderColor="rgba(255, 107, 107, 0.2)">
                                        <Text style={styles.featureIcon}>!</Text>
                    <Text style={styles.featureText}>Emergency SOS button for instant help</Text>
                  </View>
                  <View style={styles.feature}>
                    <Text style={styles.featureIcon}>L</Text>
                  </GlassCard>
                  <GlassCard style={styles.featureCard} gradient={['rgba(78, 205, 196, 0.15)', 'rgba(78, 205, 196, 0.08)']} borderColor="rgba(78, 205, 196, 0.2)">
                    <Text style={styles.featureIcon}>👥</Text>
                    <Text style={styles.featureText}>Emergency Contacts</Text>
                  </GlassCard>
                </View>
              </Animatable.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </FloatingElements>
      </LinearGradient>
    </View>
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
  gradient: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  demoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  demoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    textAlign: 'center',
    marginBottom: 5,
  },
  quickDemoButton: {
    marginTop: 15,
  },
  quickDemoText: {
    fontSize: 14,
  },
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderRadius: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 15,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    marginHorizontal: 15,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  registerButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  registerButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  registerButtonHighlight: {
    color: '#4FC3F7',
    fontWeight: 'bold',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
