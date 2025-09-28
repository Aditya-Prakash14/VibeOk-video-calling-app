import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  const [roomId, setRoomId] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Call App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Room ID"
        placeholderTextColor="#888"
        value={roomId}
        onChangeText={setRoomId}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2563eb" }]}
        onPress={() => navigation.navigate("Call", { roomId })}
      >
        <Text style={styles.buttonText}>Join Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#16a34a" }]}
        onPress={() => navigation.navigate("Call", { roomId: "new-room" })}
      >
        <Text style={styles.buttonText}>Host Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#1f2937",
    color: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
