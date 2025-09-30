
# 📹 VibeOk – React Native Video Calling App

VibeOk is a simple **video calling app** built with **React Native (Expo)**, **WebRTC**, and a custom **Node.js signaling server**.  
It allows users to create or join rooms and make peer-to-peer video calls in real time.

---

## 🚀 Features
- 📱 Cross-platform (iOS & Android via Expo)  
- 🎥 Real-time video & audio streaming with **WebRTC**  
- 🔗 Join a call by entering a **Room ID**  
- 🎤 Mute / Unmute microphone  
- 📸 Switch between front & back camera  
- 📞 End call with one tap  
- ⚡ Custom **Node.js signaling server** for peer connection setup  

---

## 🛠 Tech Stack
- **Frontend:** React Native (Expo), React Navigation  
- **WebRTC:** [`react-native-webrtc`](https://github.com/Aditya-Prakash14/VibeOk-video-calling-app)  
- **Backend:** Node.js + Socket.IO (signaling server)  
- **State Management:** React Hooks  

---

## 📂 Project Structure

VibeOk/
├── App.js # Navigation setup
├── screens/
│ ├── HomeScreen.js # Enter/join room
│ └── CallScreen.js # Video call UI
├── server/
│ └── index.js # Node.js signaling server
├── package.json
└── README.md
```bash
git clone https://github.com/Aditya-Prakash14/VibeOk-video-calling-app
cd VibeOk


