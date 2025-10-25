import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Screen</Text>
      <Text style={styles.subtitle}>This is where the camera functionality will be implemented</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Take Photo"
          onPress={() => {
            // Camera functionality will be implemented here
            console.log('Taking photo...');
          }}
        />
        <Button
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    gap: 15,
    width: '100%',
    maxWidth: 200,
  },
});
