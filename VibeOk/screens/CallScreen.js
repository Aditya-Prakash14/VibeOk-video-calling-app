import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CallScreen({ navigation, route }) {
  const { roomId } = route.params;

  return (
    <View style={styles.container}>
      {/* Remote video placeholder */}
      <View style={styles.remoteVideo}>
        <Text style={styles.text}>Remote Video</Text>
      </View>

      {/* Local video preview */}
      <View style={styles.localVideo}>
        <Text style={styles.localText}>Local Video</Text>
      </View>

      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="mic-off" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hangupButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="call" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="camera-reverse" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  remoteVideo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#374151",
    margin: 16,
    borderRadius: 12,
  },
  text: { color: "white" },
  localVideo: {
    position: "absolute",
    top: 40,
    right: 16,
    width: 120,
    height: 160,
    backgroundColor: "#4b5563",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  localText: { color: "white", fontSize: 12 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#111827",
  },
  hangupButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 40,
  },
});
