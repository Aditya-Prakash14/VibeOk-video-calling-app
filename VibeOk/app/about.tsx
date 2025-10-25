import { router } from 'expo-router';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About VibeOk</Text>
      
      <View style={styles.card}>
        <Text style={styles.appName}>VibeOk</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          A modern React Native app built with Expo Router for seamless navigation 
          and great user experience. Share your vibes with the world!
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Camera integration</Text>
          <Text style={styles.featureItem}>• User profiles</Text>
          <Text style={styles.featureItem}>• Customizable settings</Text>
          <Text style={styles.featureItem}>• Modern UI design</Text>
          <Text style={styles.featureItem}>• Cross-platform support</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.contactInfo}>
          For support or feedback, please reach out to us:
        </Text>
        <Text style={styles.email}>support@vibeok.com</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Privacy Policy"
            onPress={() => {
              console.log('Privacy Policy pressed');
            }}
          />
          <Button
            title="Terms of Service"
            onPress={() => {
              console.log('Terms of Service pressed');
            }}
          />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  contactInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  email: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  buttonGroup: {
    gap: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
