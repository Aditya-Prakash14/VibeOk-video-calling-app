# VibeOk - Video Calling App

A clean, minimal video calling app built with React Native and WebRTC.

## Features

- 🔐 User authentication (register/login)
- 👥 User list with search functionality
- 📹 One-to-one video calling with WebRTC
- 🎤 Call controls (mute, speaker, camera flip, end call)
- 🌑 Dark minimal UI design

## Tech Stack

### Frontend (React Native)
- React Native with Expo
- React Navigation
- WebRTC (react-native-webrtc)
- Socket.io-client
- Axios
- AsyncStorage

### Backend (Node.js)
- Express.js
- Socket.io (WebRTC signaling)
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- React Native development environment
- iOS Simulator / Android Emulator

## Setup Instructions

### 1. Clone the repository

```bash
cd VibeOk-video-calling-app
```

### 2. Setup Backend Server

```bash
cd server
npm install
```

Create `.env` file in the server directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vibeok
JWT_SECRET=your-secret-key-change-this-in-production
```

Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath=/path/to/your/data/directory
```

Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

### 3. Setup React Native App

```bash
cd app
npm install
```

### 4. Run the App

For iOS:
```bash
npx expo start
# Press 'i' for iOS simulator
```

For Android:
```bash
npx expo start
# Press 'a' for Android emulator
```

## Usage

1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with your credentials
3. **User List**: Browse all registered users and search by name
4. **Make Call**: Tap on a user to initiate a video call
5. **Call Controls**: 
   - Mute/unmute microphone
   - Toggle speaker
   - Flip camera (front/back)
   - End call

## Project Structure

```
VibeOk-video-calling-app/
├── app/                      # React Native frontend
│   ├── screens/             
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── UserListScreen.js
│   │   └── CallScreen.js
│   ├── services/
│   │   └── WebRTCService.js  # WebRTC peer connection logic
│   ├── App.js                # Main navigation
│   └── package.json
├── server/                   # Node.js backend
│   ├── index.js              # Express + Socket.io server
│   ├── .env                  # Environment variables
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /users` - Get all users (authenticated)

## Socket.io Events

- `register` - Register user socket connection
- `make-call` - Initiate call with offer
- `make-answer` - Answer call with answer
- `ice-candidate` - Exchange ICE candidates
- `end-call` - End active call

## Configuration

### Change Server URL

Update the server URL in the following files:

1. `app/screens/LoginScreen.js`
2. `app/screens/RegisterScreen.js`
3. `app/screens/UserListScreen.js`
4. `app/services/WebRTCService.js`

Change `http://localhost:3000` to your server IP address.

## Notes

- For testing on physical devices, make sure both devices are on the same network
- Update the server URL from `localhost` to your computer's local IP address
- WebRTC requires HTTPS in production environments
- Make sure MongoDB is running before starting the server

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `brew services list` (macOS)
- Check MongoDB URI in `.env` file

**Camera/Microphone Permission:**
- Grant permissions in iOS Settings > VibeOk
- Grant permissions in Android Settings > Apps > VibeOk

**Connection Issues:**
- Check if server is running on port 3000
- Verify firewall settings
- Use local IP instead of localhost for device testing

## License

MIT
