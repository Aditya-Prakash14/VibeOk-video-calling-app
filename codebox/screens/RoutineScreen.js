import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Switch,
  Button,
  Chip,
  IconButton,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const ROUTINE_TEMPLATES = [
  {
    id: 'morning_coder',
    name: 'Morning Coder',
    icon: 'weather-sunny',
    time: '6:00 AM - 9:00 AM',
    tasks: ['Solve 2 LeetCode problems', 'Review algorithms', 'Practice DSA'],
  },
  {
    id: 'evening_grind',
    name: 'Evening Grind',
    icon: 'weather-night',
    time: '6:00 PM - 10:00 PM',
    tasks: ['Work on projects', 'Read documentation', 'Code review'],
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    icon: 'calendar-weekend',
    time: 'All Day',
    tasks: ['Build side projects', 'Learn new tech', 'Contribute to open source'],
  },
  {
    id: 'competitive',
    name: 'Competitive Mode',
    icon: 'trophy',
    time: 'Daily',
    tasks: ['Codeforces contest', 'Upsolve problems', 'Study editorial solutions'],
  },
];

export default function RoutineScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [activeRoutines, setActiveRoutines] = useState([]);
  const [dailyGoals, setDailyGoals] = useState({
    codeforcesProblems: 0,
    leetcodeProblems: 0,
    githubCommits: 0,
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadRoutines();
    loadDailyGoals();
  }, []);

  const loadRoutines = async () => {
    try {
      const routinesData = await AsyncStorage.getItem(`routines_${user.id}`);
      if (routinesData) {
        setActiveRoutines(JSON.parse(routinesData));
      }
    } catch (error) {
      console.error('Error loading routines:', error);
    }
  };

  const loadDailyGoals = async () => {
    try {
      const goalsData = await AsyncStorage.getItem(`daily_goals_${user.id}`);
      if (goalsData) {
        setDailyGoals(JSON.parse(goalsData));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const toggleRoutine = async (routineId) => {
    let updatedRoutines;
    if (activeRoutines.includes(routineId)) {
      updatedRoutines = activeRoutines.filter((id) => id !== routineId);
      setSnackbarMessage('Routine deactivated');
    } else {
      updatedRoutines = [...activeRoutines, routineId];
      setSnackbarMessage('Routine activated!');
    }
    setActiveRoutines(updatedRoutines);
    await AsyncStorage.setItem(`routines_${user.id}`, JSON.stringify(updatedRoutines));
    setSnackbarVisible(true);
  };

  const incrementGoal = async (goalType) => {
    const updatedGoals = {
      ...dailyGoals,
      [goalType]: dailyGoals[goalType] + 1,
    };
    setDailyGoals(updatedGoals);
    await AsyncStorage.setItem(`daily_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const decrementGoal = async (goalType) => {
    if (dailyGoals[goalType] > 0) {
      const updatedGoals = {
        ...dailyGoals,
        [goalType]: dailyGoals[goalType] - 1,
      };
      setDailyGoals(updatedGoals);
      await AsyncStorage.setItem(`daily_goals_${user.id}`, JSON.stringify(updatedGoals));
    }
  };

  const resetGoals = async () => {
    const resetGoals = {
      codeforcesProblems: 0,
      leetcodeProblems: 0,
      githubCommits: 0,
    };
    setDailyGoals(resetGoals);
    await AsyncStorage.setItem(`daily_goals_${user.id}`, JSON.stringify(resetGoals));
    setSnackbarMessage('Daily goals reset!');
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Daily Routine
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Build consistent coding habits
          </Text>
        </View>

        {/* Daily Goals */}
        <Card style={styles.card}>
          <Card.Title
            title="Today's Goals"
            right={(props) => (
              <Button onPress={resetGoals} compact>
                Reset
              </Button>
            )}
          />
          <Card.Content>
            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Chip icon="code-braces" style={styles.goalChip}>
                  Codeforces
                </Chip>
                <Text variant="bodySmall" style={styles.goalLabel}>
                  Problems solved today
                </Text>
              </View>
              <View style={styles.goalCounter}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() => decrementGoal('codeforcesProblems')}
                />
                <Text variant="headlineMedium" style={styles.goalValue}>
                  {dailyGoals.codeforcesProblems}
                </Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => incrementGoal('codeforcesProblems')}
                />
              </View>
            </View>

            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Chip icon="code-tags" style={styles.goalChip}>
                  LeetCode
                </Chip>
                <Text variant="bodySmall" style={styles.goalLabel}>
                  Problems solved today
                </Text>
              </View>
              <View style={styles.goalCounter}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() => decrementGoal('leetcodeProblems')}
                />
                <Text variant="headlineMedium" style={styles.goalValue}>
                  {dailyGoals.leetcodeProblems}
                </Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => incrementGoal('leetcodeProblems')}
                />
              </View>
            </View>

            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Chip icon="github" style={styles.goalChip}>
                  GitHub
                </Chip>
                <Text variant="bodySmall" style={styles.goalLabel}>
                  Commits today
                </Text>
              </View>
              <View style={styles.goalCounter}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() => decrementGoal('githubCommits')}
                />
                <Text variant="headlineMedium" style={styles.goalValue}>
                  {dailyGoals.githubCommits}
                </Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => incrementGoal('githubCommits')}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Routine Templates */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Routine Templates
          </Text>
        </View>

        {ROUTINE_TEMPLATES.map((routine) => (
          <Card key={routine.id} style={styles.card}>
            <Card.Content>
              <View style={styles.routineHeader}>
                <View style={styles.routineInfo}>
                  <View style={styles.routineTitleRow}>
                    <IconButton icon={routine.icon} size={24} />
                    <View>
                      <Text variant="titleMedium" style={styles.routineName}>
                        {routine.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.routineTime}>
                        {routine.time}
                      </Text>
                    </View>
                  </View>
                </View>
                <Switch
                  value={activeRoutines.includes(routine.id)}
                  onValueChange={() => toggleRoutine(routine.id)}
                />
              </View>

              {activeRoutines.includes(routine.id) && (
                <View style={styles.tasksList}>
                  <Text variant="labelMedium" style={styles.tasksLabel}>
                    Tasks:
                  </Text>
                  {routine.tasks.map((task, index) => (
                    <View key={index} style={styles.taskItem}>
                      <IconButton icon="check-circle-outline" size={16} />
                      <Text variant="bodyMedium">{task}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        ))}

        <View style={styles.footer} />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666',
  },
  card: {
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 2,
    borderRadius: 12,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalInfo: {
    flex: 1,
  },
  goalChip: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  goalLabel: {
    color: '#666',
  },
  goalCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalValue: {
    minWidth: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6200ee',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineInfo: {
    flex: 1,
  },
  routineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineName: {
    fontWeight: '600',
  },
  routineTime: {
    color: '#666',
  },
  tasksList: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tasksLabel: {
    marginBottom: 10,
    color: '#666',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  footer: {
    height: 40,
  },
});
