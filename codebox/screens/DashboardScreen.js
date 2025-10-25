import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Avatar,
  Button,
  ActivityIndicator,
  Chip,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import PlatformService from '../services/PlatformService';
import ContributionHeatmap from '../components/ContributionHeatmap';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [platformData, setPlatformData] = useState({
    codeforces: null,
    github: null,
    leetcode: null,
  });

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    setLoading(true);
    const data = await PlatformService.getAllPlatformData(user.platforms);
    setPlatformData(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlatformData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Text size={60} label={user.name.charAt(0).toUpperCase()} />
          <View style={styles.userInfo}>
            <Text variant="headlineSmall" style={styles.userName}>
              {user.name}
            </Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {user.email}
            </Text>
          </View>
        </View>
        <IconButton icon="logout" onPress={logout} />
      </View>

      {/* Codeforces Stats */}
      {platformData.codeforces && (
        <Card style={styles.card}>
          <Card.Title
            title="Codeforces"
            subtitle={user.platforms.codeforces}
            left={(props) => <Avatar.Icon {...props} icon="code-braces" />}
          />
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.codeforces.rating}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Rating
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.codeforces.totalSolved}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Solved
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.codeforces.currentStreak}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Streak 🔥
                </Text>
              </View>
            </View>
            <Chip
              icon="medal"
              style={styles.rankChip}
              textStyle={{ color: theme.colors.primary }}
            >
              {platformData.codeforces.rank}
            </Chip>
            {platformData.codeforces.dailyActivity && (
              <View style={styles.heatmapSection}>
                <Divider style={styles.divider} />
                <ContributionHeatmap
                  data={platformData.codeforces.dailyActivity}
                  title="Activity"
                />
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* GitHub Stats */}
      {platformData.github && (
        <Card style={styles.card}>
          <Card.Title
            title="GitHub"
            subtitle={user.platforms.github}
            left={(props) => <Avatar.Icon {...props} icon="github" />}
          />
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.github.publicRepos}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Repos
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.github.followers}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Followers
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.github.currentStreak}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Streak 🔥
                </Text>
              </View>
            </View>
            {platformData.github.dailyActivity && (
              <View style={styles.heatmapSection}>
                <Divider style={styles.divider} />
                <ContributionHeatmap
                  data={platformData.github.dailyActivity}
                  title="Contributions"
                />
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* LeetCode Stats */}
      {platformData.leetcode && (
        <Card style={styles.card}>
          <Card.Title
            title="LeetCode"
            subtitle={user.platforms.leetcode}
            left={(props) => <Avatar.Icon {...props} icon="code-tags" />}
          />
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.leetcode.totalSolved}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Solved
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statValue}>
                  {platformData.leetcode.ranking || 'N/A'}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Ranking
                </Text>
              </View>
            </View>
            <View style={styles.difficultyStats}>
              <View style={styles.difficultyItem}>
                <Chip
                  icon="check-circle"
                  style={[styles.difficultyChip, { backgroundColor: '#00b8a3' }]}
                  textStyle={{ color: 'white' }}
                >
                  Easy: {platformData.leetcode.easySolved}
                </Chip>
              </View>
              <View style={styles.difficultyItem}>
                <Chip
                  icon="check-circle"
                  style={[styles.difficultyChip, { backgroundColor: '#ffc01e' }]}
                  textStyle={{ color: 'white' }}
                >
                  Medium: {platformData.leetcode.mediumSolved}
                </Chip>
              </View>
              <View style={styles.difficultyItem}>
                <Chip
                  icon="check-circle"
                  style={[styles.difficultyChip, { backgroundColor: '#ef4743' }]}
                  textStyle={{ color: 'white' }}
                >
                  Hard: {platformData.leetcode.hardSolved}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Empty State */}
      {!platformData.codeforces && !platformData.github && !platformData.leetcode && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Platform Data Available
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Make sure your platform usernames are correct and public.
            </Text>
            <Button
              mode="contained"
              onPress={onRefresh}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </Card.Content>
        </Card>
      )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#666',
  },
  card: {
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  rankChip: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 12,
  },
  heatmapSection: {
    marginTop: 5,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  difficultyStats: {
    marginTop: 15,
    gap: 10,
  },
  difficultyItem: {
    alignItems: 'flex-start',
  },
  difficultyChip: {
    paddingHorizontal: 5,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    alignSelf: 'center',
  },
  footer: {
    height: 20,
  },
});
