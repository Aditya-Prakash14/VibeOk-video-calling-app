# CodeBox - New Features Guide

## 🎉 New Features Added

### 1. 📊 Dashboard (Home)
Your main hub for tracking coding progress across platforms.

**Features:**
- View Codeforces rating, problems solved, and daily streak
- Track GitHub repositories, followers, and contribution heatmap
- Monitor LeetCode problems solved by difficulty
- Pull-to-refresh to update stats
- Visual contribution heatmaps (90-day view)

**Navigation:** Bottom tab icon: Dashboard

---

### 2. ✅ Daily Todo
Manage your daily coding tasks and track what you need to accomplish.

**Features:**
- ✨ Add new tasks with title and description
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 📊 View stats: pending vs completed tasks
- 💾 Persists data using AsyncStorage

**How to Use:**
1. Tap the ➕ button to add a new task
2. Enter task title (required) and description (optional)
3. Tap tasks to mark as complete
4. Swipe or tap delete icon to remove tasks

**Navigation:** Bottom tab icon: Checkbox

---

### 3. 📅 Daily Routine
Build consistent coding habits with routine templates and goal tracking.

**Features:**

#### Daily Goals Tracker
- Track problems solved on Codeforces
- Track problems solved on LeetCode  
- Track GitHub commits
- Manual counter with +/- buttons
- Reset button to start fresh each day

#### Routine Templates
Four pre-built routine templates:

**1. Morning Coder** ☀️
- Time: 6:00 AM - 9:00 AM
- Tasks: Solve 2 LeetCode problems, Review algorithms, Practice DSA

**2. Evening Grind** 🌙
- Time: 6:00 PM - 10:00 PM
- Tasks: Work on projects, Read documentation, Code review

**3. Weekend Warrior** 📅
- Time: All Day
- Tasks: Build side projects, Learn new tech, Contribute to open source

**4. Competitive Mode** 🏆
- Time: Daily
- Tasks: Codeforces contest, Upsolve problems, Study editorial solutions

**How to Use:**
1. Toggle routines on/off with the switch
2. When activated, you'll see the task list
3. Use daily goals to track your progress
4. Increment counters as you complete tasks

**Navigation:** Bottom tab icon: Calendar

---

### 4. 👤 Profile
Manage your account and platform integrations.

**Features:**
- View user information (name, email, join date)
- Edit platform usernames:
  - Codeforces
  - GitHub
  - LeetCode
- Logout functionality

**How to Use:**
1. Tap the pencil icon to edit
2. Update your platform usernames
3. Tap "Save" to update or "Cancel" to discard changes
4. Changes sync immediately with your dashboard

**Navigation:** Bottom tab icon: Account Circle

---

## 🎨 UI/UX Improvements

### SafeAreaView Integration
- All screens now respect device safe areas (notch, home indicator)
- No content hidden behind iPhone notches
- Proper spacing on all devices

### Smooth Scrolling
- Nested scroll support for heatmaps
- No scroll conflicts
- Hidden scroll indicators for cleaner look

### Material Design
- Consistent React Native Paper components
- Elevation and shadows for depth
- Color-coded elements for better UX

---

## 📱 Bottom Tab Navigation

Navigate between sections with a single tap:

| Tab | Icon | Screen |
|-----|------|--------|
| Dashboard | View Dashboard | Platform stats & analytics |
| Todo | Checkbox Circle | Daily task manager |
| Routine | Calendar Check | Habit tracker & routines |
| Profile | Account Circle | Settings & account info |

---

## 💾 Data Persistence

All data is saved locally using AsyncStorage:
- **Todos**: Stored per user, persists across app restarts
- **Routines**: Active routines saved per user
- **Daily Goals**: Counter values saved automatically
- **Profile**: Platform usernames synced with auth

---

## 🚀 Quick Start Guide

### First Time Setup
1. **Register** with your name, email, and platform usernames
2. Explore the **Dashboard** to see your coding stats
3. Add your first **Todo** task for today
4. Activate a **Routine** template that matches your schedule
5. Track your progress using **Daily Goals**

### Daily Workflow
1. Start your day by checking the **Dashboard**
2. Review your **Todo** list
3. Update **Daily Goals** as you solve problems
4. Follow your active **Routine**
5. Edit your **Profile** if you change platforms

---

## 🎯 Tips & Best Practices

### Maximize Productivity
- ✅ Set daily goals and track them honestly
- ✅ Use Todo for specific tasks (not just "code more")
- ✅ Activate routines that match your schedule
- ✅ Update platform usernames if you create new accounts
- ✅ Pull-to-refresh dashboard to see latest stats

### Routine Tips
- Start with one routine, don't overwhelm yourself
- Morning Coder works best for consistency
- Competitive Mode is for contest preparation
- Weekend Warrior is for deep work sessions

### Goal Setting
- Set realistic daily goals
- Start small (e.g., 1-2 problems per day)
- Gradually increase as you build the habit
- Use the reset button at the end of each day

---

## 🔄 Data Flow

```
Register → Set Platform Usernames → Dashboard Fetches Data
    ↓
Login → Restore User Data → Access All Features
    ↓
Todo → Add/Complete Tasks → Saved to AsyncStorage
    ↓
Routine → Activate Templates → Track Goals → Manual Updates
    ↓
Profile → Edit Usernames → Updates Auth Context → Dashboard Refreshes
```

---

## 🐛 Troubleshooting

### Dashboard not showing data
- Verify platform usernames in Profile
- Make sure profiles are public
- Pull down to refresh

### Todos not saving
- Ensure you're logged in
- Check storage permissions

### Daily goals not updating
- Tap +/- buttons to increment/decrement
- Use reset button if counts seem off

---

## 🎨 Color Coding

- **Purple (#6200ee)**: Primary actions and stats
- **Green**: Completed tasks, active routines
- **Red**: Delete actions, errors
- **Gray**: Inactive/disabled elements
- **Contribution Heatmap**: Green gradient (light to dark)

---

## 🔐 Privacy & Security

- All data stored locally on your device
- No backend server (demo version)
- Platform usernames must be public for APIs to work
- For production, implement proper backend authentication

---

## 🚧 Future Enhancements

Planned features:
- [ ] Push notifications for routine reminders
- [ ] Streak visualization and badges
- [ ] Custom routine builder
- [ ] Todo categories and priorities
- [ ] Export stats and reports
- [ ] Dark mode support
- [ ] Cloud sync across devices

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify internet connection for API calls
3. Restart the app
4. Clear app data and re-register (last resort)

---

Built with ❤️ using React Native, Expo, and React Native Paper
