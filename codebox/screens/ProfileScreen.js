import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TextInput,
  Button,
  Avatar,
  Card,
  Divider,
  useTheme,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, updatePlatforms } = useAuth();
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [codeforces, setCodeforces] = useState(user.platforms.codeforces || '');
  const [github, setGithub] = useState(user.platforms.github || '');
  const [leetcode, setLeetcode] = useState(user.platforms.leetcode || '');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSave = async () => {
    const result = await updatePlatforms({
      codeforces,
      github,
      leetcode,
    });

    if (result.success) {
      setSnackbarMessage('Profile updated successfully!');
      setEditing(false);
    } else {
      setSnackbarMessage('Failed to update profile');
    }
    setSnackbarVisible(true);
  };

  const handleCancel = () => {
    setCodeforces(user.platforms.codeforces || '');
    setGithub(user.platforms.github || '');
    setLeetcode(user.platforms.leetcode || '');
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user.name.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user.email}
          </Text>
          <Text variant="bodySmall" style={styles.joinDate}>
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Platform Settings */}
        <Card style={styles.card}>
          <Card.Title
            title="Platform Accounts"
            right={(props) =>
              !editing && (
                <IconButton
                  {...props}
                  icon="pencil"
                  onPress={() => setEditing(true)}
                />
              )
            }
          />
          <Card.Content>
            <TextInput
              label="Codeforces Username"
              value={codeforces}
              onChangeText={setCodeforces}
              mode="outlined"
              disabled={!editing}
              style={styles.input}
              left={<TextInput.Icon icon="code-braces" />}
            />

            <TextInput
              label="GitHub Username"
              value={github}
              onChangeText={setGithub}
              mode="outlined"
              disabled={!editing}
              style={styles.input}
              left={<TextInput.Icon icon="github" />}
            />

            <TextInput
              label="LeetCode Username"
              value={leetcode}
              onChangeText={setLeetcode}
              mode="outlined"
              disabled={!editing}
              style={styles.input}
              left={<TextInput.Icon icon="code-tags" />}
            />

            {editing && (
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.button}
                >
                  Save
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="outlined"
              icon="logout"
              onPress={logout}
              style={styles.logoutButton}
              textColor={theme.colors.error}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer} />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    marginBottom: 15,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#666',
    marginBottom: 5,
  },
  joinDate: {
    color: '#999',
  },
  card: {
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 2,
    borderRadius: 12,
  },
  input: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
  },
  logoutButton: {
    borderColor: '#ef4743',
  },
  footer: {
    height: 40,
  },
});
