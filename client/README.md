# VibeOk Client - React Native App

A clean, minimal video calling app with Supabase authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Setup Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Update `client/lib/supabase.js` with your credentials:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

Or create a `.env` file:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the App

```bash
npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Features

- ✅ Welcome screen with app branding
- ✅ User registration with email verification
- ✅ Login with email/password
- ✅ Supabase authentication integration
- ✅ Dark minimal UI design
- ✅ Form validation
- ✅ Loading states

## Tech Stack

- React Native with Expo
- Supabase (Authentication & Database)
- React Navigation
- AsyncStorage
- Linear Gradient backgrounds

## Project Structure

```
client/
├── screens/
│   ├── WelcomeScreen.js    # Landing page
│   ├── LoginScreen.js      # Login form
│   └── RegisterScreen.js   # Registration form
├── lib/
│   └── supabase.js         # Supabase client config
├── App.js                  # Main app with navigation
└── package.json
```

## Next Steps

To add video calling functionality:
1. Create a Home screen for logged-in users
2. Add user list to select who to call
3. Integrate WebRTC for video calls
4. Add call controls (mute, speaker, camera flip)
