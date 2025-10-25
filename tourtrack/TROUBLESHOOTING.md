# SOS App - Troubleshooting Guide

## Common Issues and Solutions

### 🌍 Location/Geocoding Issues

#### Issue: "Geocoding rate limit exceeded - too many requests"
**Cause**: The app is making too many requests to the geocoding service.

**Solutions**:
1. **Wait and Retry**: Wait 10-15 seconds before trying again
2. **Use Coordinates**: The app will now automatically fallback to showing coordinates instead of address
3. **Check Internet**: Ensure you have a stable internet connection

**Fixed in Latest Version**:
- ✅ Automatic fallback to coordinates when geocoding fails
- ✅ Rate limit protection with 3-second minimum between SOS calls
- ✅ Better error messages and retry options

#### Issue: "Unable to get current location"
**Cause**: Location permissions or GPS issues.

**Solutions**:
1. **Check Permissions**:
   - iOS: Settings → Privacy & Security → Location Services → [App Name] → "While Using App"
   - Android: Settings → Apps → [App Name] → Permissions → Location → Allow

2. **Enable Location Services**:
   - iOS: Settings → Privacy & Security → Location Services → ON
   - Android: Settings → Location → ON

3. **Try Different Locations**:
   - Go outside for better GPS signal
   - Move away from tall buildings
   - Wait a few moments for GPS to acquire signal

4. **Restart the App**: Force close and reopen the app

### 📱 App-Specific Issues

#### Issue: SOS Button Not Working
**Solutions**:
1. **Fill Required Information**: Make sure your name is entered
2. **Wait Between Attempts**: Wait at least 3 seconds between SOS attempts
3. **Check Internet Connection**: Ensure you're connected to internet

#### Issue: Data Not Saving to Database
**Solutions**:
1. **Check Internet**: Verify internet connection
2. **Verify Supabase Setup**: Ensure database table exists and credentials are correct
3. **Check Console**: Look for error messages in the app console

### 🔧 Technical Solutions

#### For Developers

**1. Location Service Optimization**
```javascript
// The app now includes fallback mechanisms:
- Automatic retry with exponential backoff
- Coordinate-based fallback when geocoding fails
- Rate limiting to prevent API abuse
- Better error handling and user messaging
```

**2. Testing in Different Environments**

**Simulator/Emulator**:
- iOS Simulator: Debug → Location → Custom Location
- Android Emulator: Extended Controls → Location
- Set coordinates to: 37.7749, -122.4194 (San Francisco)

**Physical Device**:
- Enable location permissions
- Test outdoors for best GPS accuracy
- Ensure device has internet connection

**3. Database Connection Issues**
```javascript
// Verify your Supabase configuration:
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// Test connection:
const { data, error } = await supabase
  .from('sos_alerts')
  .select('count(*)')
  .single();
```

### 🚨 Emergency Situations

#### If the App Fails During Real Emergency:

1. **Call Emergency Services Directly**:
   - US: 911
   - UK: 999
   - EU: 112
   - Australia: 000

2. **Share Location Manually**:
   - Open native Maps app
   - Share your current location via text/messaging apps
   - Send coordinates to emergency contacts

3. **Use Alternative Apps**:
   - Built-in emergency features (iPhone: Emergency SOS, Android: Emergency button)
   - Other emergency apps as backup

### 🔄 Recovery Steps

#### Reset App Data:
1. Close the app completely
2. Clear app cache (Android) or reinstall (iOS)
3. Reopen and re-enter your information
4. Test SOS functionality

#### Network Issues:
1. Try switching between WiFi and mobile data
2. Check if other apps can connect to internet
3. Restart your device's network settings

#### Location Issues:
1. Toggle location services off and on
2. Restart the device
3. Check for iOS/Android system updates
4. Try the app in a different location

### 📊 App Status Indicators

**Green Indicators** (Everything Working):
- ✅ Location permission granted
- ✅ Internet connection active
- ✅ Database connection successful
- ✅ User information saved

**Yellow Indicators** (Partial Issues):
- ⚠️ Geocoding unavailable (coordinates will be used)
- ⚠️ Slow internet connection
- ⚠️ GPS signal weak

**Red Indicators** (Needs Attention):
- ❌ Location permission denied
- ❌ No internet connection
- ❌ Database connection failed
- ❌ Critical error occurred

### 🛠️ Advanced Troubleshooting

#### For Expo CLI Issues:
```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
npx react-native start --reset-cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### For Location Service Issues:
```bash
# Check if location services are working
expo install expo-location
expo install expo-permissions
```

#### Database Connection Test:
1. Open your Supabase dashboard
2. Go to API → JavaScript
3. Test the connection with the provided code snippet

### 📞 Getting Help

**Priority Order for Emergency Apps**:
1. **During Real Emergency**: Call emergency services directly (911, 999, 112, etc.)
2. **App Issues**: Follow this troubleshooting guide
3. **Technical Support**: Check app console for error messages
4. **Report Bugs**: Document the issue with screenshots and error messages

**Remember**: This app is a supplementary tool. Always have backup emergency plans and know your local emergency numbers.
