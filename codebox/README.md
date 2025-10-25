# CodeBox - Coding Progress Tracker

A React Native app built with Expo and React Native Paper to track your coding progress across multiple platforms.

## Features

✨ **Multi-Platform Tracking**
- Codeforces stats (rating, problems solved, daily streak)
- GitHub contributions (repositories, followers, contribution graph)
- LeetCode progress (problems solved by difficulty, ranking)

🔥 **Daily Streak Tracking**
- Track your consistency across all platforms
- Visual contribution heatmaps

📊 **Beautiful Dashboard**
- Material Design UI with React Native Paper
- Real-time data from platform APIs
- Pull-to-refresh functionality

🔐 **Simple Authentication**
- Local authentication with AsyncStorage
- Secure platform username management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app on your phone)

## Installation

1. Navigate to the codebox directory:
```bash
cd /Users/adityaprakash/Desktop/DESKTOP-MAIN/react-native/codebox
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## Usage

### First Time Setup

1. **Register an Account**
   - Open the app and tap "Register"
   - Enter your name, email, and password
   - Add your platform usernames:
     - **Codeforces**: Your handle (e.g., "tourist")
     - **GitHub**: Your username (e.g., "torvalds")
     - **LeetCode**: Your username
   - Note: Add at least one platform username

2. **View Your Dashboard**
   - After registration, you'll see your personalized dashboard
   - The app will fetch your stats from all configured platforms
   - Pull down to refresh your data

### Features on Dashboard

- **Codeforces Card**: Shows rating, rank, problems solved, and activity heatmap
- **GitHub Card**: Shows repositories, followers, and contribution heatmap
- **LeetCode Card**: Shows problems solved by difficulty and ranking
- **Streak Tracking**: See your daily coding streak for each platform

## Platform APIs Used

### Codeforces
- **User Info**: `https://codeforces.com/api/user.info`
- **Submissions**: `https://codeforces.com/api/user.status`

### GitHub
- **User Info**: `https://api.github.com/users/{username}`
- **Events**: `https://api.github.com/users/{username}/events/public`

### LeetCode
- **Stats**: `https://leetcode-stats-api.herokuapp.com/{username}`

## Project Structure

```
codebox/
├── App.js                          # Main app component with navigation
├── index.js                        # Entry point with PaperProvider
├── babel.config.js                 # Babel configuration
├── package.json                    # Dependencies
├── context/
│   └── AuthContext.js             # Authentication state management
├── screens/
│   ├── LoginScreen.js             # Login UI
│   ├── RegisterScreen.js          # Registration with platform usernames
│   └── DashboardScreen.js         # Main dashboard with stats
├── services/
│   └── PlatformService.js         # API integration for all platforms
└── components/
    └── ContributionHeatmap.js     # GitHub-style contribution calendar
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Native Paper** - Material Design components
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API calls

## Notes

- Platform usernames must be public for APIs to fetch data
- Some APIs have rate limits, so frequent refreshing may be limited
- This is a demo app with local authentication (not production-ready)
- For production, implement proper backend authentication and data storage

## Troubleshooting

### Data not loading
- Verify your platform usernames are correct
- Make sure your profiles are public
- Check your internet connection
- Try pulling down to refresh

### API errors
- Some APIs may have rate limits
- LeetCode API endpoint may occasionally be unavailable
- GitHub API has a rate limit for unauthenticated requests

## Future Enhancements

- [ ] Add more platforms (HackerRank, CodeChef, etc.)
- [ ] Backend authentication with user accounts
- [ ] Push notifications for streak reminders
- [ ] Detailed analytics and insights
- [ ] Friend comparisons and leaderboards
- [ ] Export stats and reports

## License

MIT

## Author

Built with ❤️ using React Native and Expo
