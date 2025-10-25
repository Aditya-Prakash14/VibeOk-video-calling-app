# TourTrack - Tourist Safety App

A comprehensive React Native Expo app designed to provide emergency assistance and safety features for tourists, with user authentication and emergency SOS functionality.

## Features

### Authentication System
- 🔐 User registration and login with Supabase Auth
- 👤 Tourist profile management with personal information
- 🔒 Secure session management with persistent login
- 📱 Multi-step registration process for tourists

### Emergency Features
- 🚨 Emergency SOS button with location tracking
- 📍 Automatic location detection and address resolution
- 📱 Device information collection
- 🗂️ Multiple emergency types (Medical, Fire, Police, Accident, etc.)
- 💬 Custom emergency messages
- 📞 Emergency contacts management
- 💾 Data storage in Supabase database linked to tourist profiles

### Safety Features  
- 🌐 Real-time location tracking during emergencies
- 📋 Tourist information storage (passport, nationality, etc.)
- 🚨 One-tap emergency alerts
- 📞 Emergency contact notifications

## Project Structure

```
tourtrack/
├── App.js                          # Main app with navigation
├── config/supabase.js              # Database configuration
├── context/AuthContext.js          # Authentication state management
├── screens/
│   ├── LoginScreen.js              # User login
│   ├── RegisterScreen.js           # Tourist registration
│   ├── DashboardScreen.js          # Main authenticated interface
│   ├── SOSScreen.js                # Emergency SOS interface
│   └── EmergencyContactsScreen.js  # Emergency contacts management
├── services/AuthService.js         # Authentication logic
└── utils/services.js               # Location and emergency utilities
```

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard and note down:
   - Project URL
   - Anon public key
3. Go to SQL Editor and run the following SQL to create the table:

```sql
CREATE TABLE sos_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20),
  user_email VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  emergency_type VARCHAR(100) DEFAULT 'general',
  message TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(255)
);

-- Enable Row Level Security
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert for all users
CREATE POLICY "Allow insert for all users" ON sos_alerts FOR INSERT WITH CHECK (true);

-- Create policy to allow select for all users (for website dashboard)
CREATE POLICY "Allow select for all users" ON sos_alerts FOR SELECT USING (true);

-- Create policy to allow update for all users (for resolving alerts)
CREATE POLICY "Allow update for all users" ON sos_alerts FOR UPDATE USING (true);
```

### 2. App Configuration

1. Open `config/supabase.js`
2. Replace `YOUR_SUPABASE_URL` with your actual Supabase project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your actual Supabase anon key

### 3. Running the App

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For web
```

## App Flow

1. **Setup**: User enters their emergency contact information
2. **Emergency Type**: User selects the type of emergency
3. **SOS Alert**: User presses the SOS button
4. **Location**: App automatically gets user's current location
5. **Database**: Alert is saved to Supabase with all information
6. **Confirmation**: User receives confirmation with alert details

## Data Structure

Each SOS alert contains:
- User information (name, phone, email)
- Location data (latitude, longitude, address)
- Emergency type
- Custom message (optional)
- Device information
- Timestamp
- Resolution status

## Web Dashboard

You can create a web dashboard to view all SOS alerts by connecting to the same Supabase database. The data is accessible via Supabase's REST API or real-time subscriptions.

Example query to get all alerts:
```javascript
const { data, error } = await supabase
  .from('sos_alerts')
  .select('*')
  .order('created_at', { ascending: false });
```

## Permissions Required

The app requires the following permissions:
- **Location**: To get user's current location for emergency alerts
- **Device Info**: To collect device information for better assistance

## Emergency Types

- Medical Emergency
- Fire Emergency  
- Police/Crime
- Accident
- Natural Disaster
- General Emergency

## Security

- All data is stored securely in Supabase
- Row Level Security (RLS) is enabled
- Location data is only collected when SOS is triggered
- User information is stored locally in the app

## Future Enhancements

- [ ] SMS notifications to emergency contacts
- [ ] Integration with local emergency services
- [ ] Voice recording for emergency messages
- [ ] Offline alert queuing
- [ ] Multiple emergency contact support
- [ ] Real-time location tracking during emergency
- [ ] Photo/video attachment support

## Support

For any issues or questions, please check the Expo and Supabase documentation or create an issue in this repository.
