import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';

export default function ContributionHeatmap({ data, title }) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Generate last 90 days for better mobile viewing (instead of 365)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = generateDates();

  // Group dates by week
  const weeks = [];
  let currentWeek = [];
  dates.forEach((date, index) => {
    currentWeek.push(date);
    if (currentWeek.length === 7 || index === dates.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Get contribution level (0-4) based on count
  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  // Get color based on level
  const getColor = (level) => {
    const colors = {
      0: '#ebedf0',
      1: '#9be9a8',
      2: '#40c463',
      3: '#30a14e',
      4: '#216e39',
    };
    return colors[level] || colors[0];
  };

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>
      )}
      
      <View style={styles.heatmapWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
        >
          <View style={styles.heatmapContainer}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((date, dayIndex) => {
                const count = data[date] || 0;
                const level = getContributionLevel(count);
                const color = getColor(level);

                return (
                  <Surface
                    key={date}
                    style={[
                      styles.day,
                      { backgroundColor: color },
                    ]}
                    elevation={0}
                  />
                );
              })}
            </View>
          ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.legend}>
        <Text variant="bodySmall" style={styles.legendText}>Less</Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <Surface
            key={level}
            style={[
              styles.legendBox,
              { backgroundColor: getColor(level) },
            ]}
            elevation={0}
          />
        ))}
        <Text variant="bodySmall" style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  title: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 13,
  },
  heatmapWrapper: {
    height: 110,
  },
  scrollContent: {
    paddingRight: 15,
    paddingVertical: 5,
  },
  heatmapContainer: {
    flexDirection: 'row',
    gap: 2.5,
  },
  week: {
    gap: 2.5,
  },
  day: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 2.5,
  },
  legendBox: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
  legendText: {
    color: '#666',
    fontSize: 11,
    marginHorizontal: 4,
  },
});
