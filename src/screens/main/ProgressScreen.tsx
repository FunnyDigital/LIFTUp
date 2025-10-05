import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import { RootState } from '@/store';

const { width } = Dimensions.get('window');

const ProgressScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  // Get real user data from Redux
  const userProfile = useSelector((state: RootState) => state.user.profile);
  
  const periods = ['Week', 'Month', '3 Months', 'Year'];
  
  const stats = {
    currentWeight: userProfile?.weight || 0,
    startWeight: userProfile?.weight ? userProfile.weight + 2.5 : 0, // TODO: Store initial weight
    targetWeight: userProfile?.weight ? userProfile.weight - 2 : 0, // TODO: Store target weight
    workoutsCompleted: 0, // TODO: Track from workout sessions
    workoutsPlanned: (userProfile?.workoutDaysPerWeek || 3) * 4, // weeks in month
    caloriesBurned: 0, // TODO: Calculate from completed workouts
    averageWorkoutTime: 45,
  };
  
  const weightProgress = [
    { date: 'Jan 1', weight: 73.0 },
    { date: 'Jan 8', weight: 72.5 },
    { date: 'Jan 15', weight: 72.2 },
    { date: 'Jan 22', weight: 71.8 },
    { date: 'Jan 29', weight: 71.2 },
    { date: 'Feb 5', weight: 70.9 },
    { date: 'Feb 12', weight: 70.5 },
  ];
  
  const achievements = [
    {
      id: 1,
      title: 'First Workout',
      description: 'Completed your first workout session',
      icon: '🎉',
      date: 'Jan 2, 2024',
      earned: true,
    },
    {
      id: 2,
      title: 'Consistency King',
      description: '7 consecutive workout days',
      icon: '🔥',
      date: 'Jan 15, 2024',
      earned: true,
    },
    {
      id: 3,
      title: 'Nigerian Warrior',
      description: 'Completed 10 Nigerian-themed workouts',
      icon: '🇳🇬',
      date: 'Jan 28, 2024',
      earned: true,
    },
    {
      id: 4,
      title: 'Weight Loss Milestone',
      description: 'Lost 2.5kg towards your goal',
      icon: '⚖️',
      date: 'Feb 12, 2024',
      earned: true,
    },
    {
      id: 5,
      title: 'Gym Regular',
      description: 'Complete 50 workouts',
      icon: '💪',
      date: 'Coming soon',
      earned: false,
    },
  ];
  
  const weeklyData = [
    { day: 'Mon', workouts: 1, calories: 320 },
    { day: 'Tue', workouts: 0, calories: 0 },
    { day: 'Wed', workouts: 1, calories: 420 },
    { day: 'Thu', workouts: 0, calories: 0 },
    { day: 'Fri', workouts: 1, calories: 380 },
    { day: 'Sat', workouts: 1, calories: 450 },
    { day: 'Sun', workouts: 0, calories: 150 },
  ];
  
  const StatCard = ({ 
    title, 
    value, 
    unit, 
    subtitle, 
    icon,
    color = theme.colors.white 
  }: {
    title: string;
    value: string | number;
    unit?: string;
    subtitle?: string;
    icon: string;
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.gray800 }]}>
      <Text style={[styles.statIcon, { color }]}>{icon}</Text>
      <Text style={[styles.statTitle, { color: theme.colors.gray300 }]}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {unit && <Text style={[styles.statUnit, { color }]}>{unit}</Text>}
      </View>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.colors.gray400 }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
  
  const WeeklyChart = () => {
    const maxCalories = Math.max(...weeklyData.map(d => d.calories));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: theme.colors.white }]}>
          This Week's Activity
        </Text>
        <View style={styles.chart}>
          {weeklyData.map((data, index) => {
            const barHeight = maxCalories > 0 ? (data.calories / maxCalories) * 100 : 0;
            return (
              <View key={data.day} style={styles.chartBar}>
                <View style={[
                  styles.bar,
                  {
                    height: `${barHeight}%`,
                    backgroundColor: data.workouts > 0 ? theme.colors.white : theme.colors.gray600,
                  }
                ]} />
                <Text style={[styles.barLabel, { color: theme.colors.gray400 }]}>
                  {data.day}
                </Text>
                <Text style={[styles.barValue, { color: theme.colors.white }]}>
                  {data.calories}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  
  const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => (
    <View style={[
      styles.achievementCard,
      {
        backgroundColor: theme.colors.gray800,
        opacity: achievement.earned ? 1 : 0.6,
      }
    ]}>
      <Text style={[styles.achievementIcon, { color: theme.colors.white }]}>
        {achievement.icon}
      </Text>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, { color: theme.colors.white }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.colors.gray400 }]}>
          {achievement.description}
        </Text>
        <Text style={[styles.achievementDate, { color: theme.colors.gray500 }]}>
          {achievement.date}
        </Text>
      </View>
      {achievement.earned && (
        <Text style={[styles.earnedBadge, { color: theme.colors.white }]}>
          ✓
        </Text>
      )}
    </View>
  );

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Progress 📊
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            Track your fitness journey
          </Text>
        </View>

        {/* Period Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodContainer}
          contentContainerStyle={styles.periods}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period 
                    ? theme.colors.white 
                    : theme.colors.gray800,
                }
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                {
                  color: selectedPeriod === period 
                    ? theme.colors.black 
                    : theme.colors.white,
                }
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Current Weight"
            value={stats.currentWeight}
            unit="kg"
            subtitle={`-${(stats.startWeight - stats.currentWeight).toFixed(1)}kg from start`}
            icon="⚖️"
          />
          <StatCard
            title="Workouts"
            value={stats.workoutsCompleted}
            subtitle={`${Math.round((stats.workoutsCompleted / stats.workoutsPlanned) * 100)}% of goal`}
            icon="💪"
          />
          <StatCard
            title="Calories Burned"
            value={stats.caloriesBurned.toLocaleString()}
            subtitle="This month"
            icon="🔥"
          />
          <StatCard
            title="Avg Workout"
            value={stats.averageWorkoutTime}
            unit="min"
            subtitle="Duration"
            icon="⏱️"
          />
        </View>

        {/* Weekly Chart */}
        <View style={[styles.chartSection, { backgroundColor: theme.colors.gray800 }]}>
          <WeeklyChart />
        </View>

        {/* Goal Progress */}
        <View style={[styles.goalSection, { backgroundColor: theme.colors.gray800 }]}>
          <Text style={[styles.goalTitle, { color: theme.colors.white }]}>
            Weight Loss Goal 🎯
          </Text>
          <View style={styles.goalProgress}>
            <View style={styles.goalStats}>
              <Text style={[styles.goalCurrent, { color: theme.colors.white }]}>
                {stats.currentWeight}kg
              </Text>
              <Text style={[styles.goalTarget, { color: theme.colors.gray400 }]}>
                Target: {stats.targetWeight}kg
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.gray600 }]} />
              <View style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.white,
                  width: `${((stats.startWeight - stats.currentWeight) / (stats.startWeight - stats.targetWeight)) * 100}%`,
                }
              ]} />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.gray400 }]}>
              {Math.round(((stats.startWeight - stats.currentWeight) / (stats.startWeight - stats.targetWeight)) * 100)}% 
              to goal
            </Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            Achievements 🏆
          </Text>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  periodContainer: {
    marginBottom: 24,
  },
  periods: {
    paddingRight: 20,
    gap: 12,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 14,
    marginLeft: 2,
  },
  statSubtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  chartSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  chartContainer: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  barValue: {
    fontSize: 10,
    marginTop: 2,
  },
  goalSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  goalProgress: {
    flex: 1,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalCurrent: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalTarget: {
    fontSize: 14,
  },
  progressBarContainer: {
    position: 'relative',
    height: 8,
    marginBottom: 8,
  },
  progressBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
  },
  earnedBadge: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProgressScreen;