import { router } from 'expo-router';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to VibeOk</Text>
      <Text style={styles.subtitle}>Choose where you'd like to go:</Text>
      
      <View style={styles.navigationContainer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="📸 Camera" 
            onPress={() => router.push('/camera')}
          />
        </View>
        
        <View style={styles.buttonWrapper}>
          <Button 
            title="👤 Profile" 
            onPress={() => router.push('/profile')}
          />
        </View>
        
        <View style={styles.buttonWrapper}>
          <Button 
            title="⚙️ Settings" 
            onPress={() => router.push('/settings')}
          />
        </View>
        
        <View style={styles.buttonWrapper}>
          <Button 
            title="ℹ️ About" 
            onPress={() => router.push('/about')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  navigationContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  buttonWrapper: {
    marginVertical: 5,
  },
});
