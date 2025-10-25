# SOS Emergency App - Setup Guide

## Quick Start

### Step 1: Supabase Setup

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - In your Supabase dashboard, go to Settings → API
   - Copy your:
     - Project URL (looks like: `https://xyzabc123.supabase.co`)
     - Anon public key (long string starting with `eyJ...`)

3. **Create the Database Table**
   - Go to SQL Editor in your Supabase dashboard
   - Paste and run this SQL:

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

-- Create policies to allow operations
CREATE POLICY "Allow insert for all users" ON sos_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for all users" ON sos_alerts FOR SELECT USING (true);
CREATE POLICY "Allow update for all users" ON sos_alerts FOR UPDATE USING (true);
```

### Step 2: Configure the App

1. **Update Supabase Configuration**
   - Open `config/supabase.js`
   - Replace `YOUR_SUPABASE_URL` with your actual Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your actual Anon key

```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key-here';
```

### Step 3: Install Dependencies

```bash
# Make sure you're in the project directory
cd /path/to/your/project

# Install all dependencies
npm install

# Start the development server
npm start
```

### Step 4: Test the App

1. **Choose a Platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

2. **Test SOS Functionality**
   - Enter your information when prompted
   - Select an emergency type
   - Press the SOS button
   - Check your Supabase dashboard to see the alert

### Step 5: Setup Web Dashboard

1. **Configure Web Dashboard**
   - Open `web-dashboard.html`
   - Replace the Supabase credentials with your actual values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

2. **Use the Dashboard**
   - Open `web-dashboard.html` in any web browser
   - View all SOS alerts in real-time
   - Mark alerts as resolved
   - Filter by status or emergency type

## App Features

### ✅ What Works Now
- ✅ SOS button with location tracking
- ✅ User information management
- ✅ Emergency type selection
- ✅ Real-time location capture
- ✅ Address resolution from coordinates
- ✅ Device information collection
- ✅ Supabase database integration
- ✅ Web dashboard for monitoring
- ✅ Alert resolution system

### 🚀 Future Enhancements
- [ ] Push notifications
- [ ] SMS integration
- [ ] Multiple emergency contacts
- [ ] Offline alert queuing
- [ ] Voice recording
- [ ] Photo/video attachment
- [ ] Integration with local emergency services

## Troubleshooting

### Common Issues

1. **Location Permission Denied**
   - Go to your device settings
   - Find the app and enable location permissions
   - Restart the app

2. **Supabase Connection Error**
   - Check your internet connection
   - Verify your Supabase credentials are correct
   - Make sure the database table exists

3. **Build Errors**
   - Try deleting `node_modules` and running `npm install` again
   - Clear Expo cache: `expo start -c`

### Testing Location

If you're testing on a simulator:
- **iOS Simulator**: Debug → Location → Custom Location
- **Android Emulator**: Extended Controls → Location
- **Web**: Browser will ask for location permission

### Database Verification

To check if your data is being saved:
1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Select the `sos_alerts` table
4. You should see your test alerts

## Security Notes

- Never commit your Supabase credentials to version control
- Use environment variables for production
- Consider implementing user authentication for production use
- Review Row Level Security policies for your use case

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Supabase credentials are correct
4. Test on a different device/simulator

For development help:
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
