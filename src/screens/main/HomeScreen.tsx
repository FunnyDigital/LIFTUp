import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import { quickSeedForDevelopment } from '@/utils/seedData';
import { RootState } from '@/store';
import { workoutGenerationService } from '@/services/workoutGenerationService';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  
  // Get today's workout recommendation
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null);
  
  useEffect(() => {
    if (userProfile) {
      const workout = workoutGenerationService.getTodaysWorkout(userProfile);
      setTodaysWorkout(workout);
    }
  }, [userProfile]);

  const handleSeedDatabase = async () => {
    Alert.alert(
      'Seed Database',
      'This will populate your Firestore database with Nigerian fitness content including workouts, exercises, foods, and meal plans. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed Database',
          onPress: async () => {
            try {
              setIsSeeding(true);
              await quickSeedForDevelopment();
              Alert.alert(
                'Success! 🎉',
                'Database has been seeded with Nigerian fitness content:\n\n• 10+ exercises\n• 3 workout routines\n• 4 workout plans\n• 15+ Nigerian foods\n• 6 meal templates\n• 3 diet plans\n\nRestart the app to see the changes in the Workouts screen.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Seeding error:', error);
              Alert.alert(
                'Error',
                'Failed to seed database. Please check your Firebase connection and try again.'
              );
            } finally {
              setIsSeeding(false);
            }
          },
        },
      ]
    );
  };
  
  // Get user's first name or default
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! ☀️';
    if (hour < 18) return 'Good afternoon! 👋';
    return 'Good evening! 🌙';
  };
  
  const userName = userProfile?.firstName || user?.email?.split('@')[0] || 'Champion';

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.gray300 }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.userName, { color: theme.colors.white }]}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={[styles.notificationIcon, { color: theme.colors.white }]}>
              🔔
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.gray800 }]}>
            <Text style={[styles.statValue, { color: theme.colors.white }]}>4</Text>
            <Text style={[styles.statLabel, { color: theme.colors.gray300 }]}>
              Workouts this week
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.gray800 }]}>
            <Text style={[styles.statValue, { color: theme.colors.white }]}>2,340</Text>
            <Text style={[styles.statLabel, { color: theme.colors.gray300 }]}>
              Calories burned
            </Text>
          </View>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            {todaysWorkout ? "Today's Workout" : "Your Workout Plan"}
          </Text>
          {todaysWorkout ? (
            <View style={[styles.workoutCard, { backgroundColor: theme.colors.gray800 }]}>
              <View style={styles.workoutHeader}>
                <Text style={[styles.workoutTitle, { color: theme.colors.white }]}>
                  {todaysWorkout.name}
                </Text>
                <Text style={[styles.workoutDuration, { color: theme.colors.gray300 }]}>
                  {todaysWorkout.durationMinutes} min
                </Text>
              </View>
              <Text style={[styles.workoutDescription, { color: theme.colors.gray400 }]}>
                {todaysWorkout.description}
              </Text>
              <TouchableOpacity style={[styles.startButton, { backgroundColor: theme.colors.white }]}>
                <Text style={[styles.startButtonText, { color: theme.colors.black }]}>
                  Start Workout
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.workoutCard, { backgroundColor: theme.colors.gray800 }]}>
              <Text style={[styles.workoutTitle, { color: theme.colors.white }]}>
                Complete your profile to get personalized workouts
              </Text>
              <Text style={[styles.workoutDescription, { color: theme.colors.gray400 }]}>
                Go to Profile → Edit Profile to add your fitness goals and preferences
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.gray800 }]}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={[styles.actionLabel, { color: theme.colors.white }]}>
                Log Meal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.gray800 }]}>
              <Text style={styles.actionIcon}>⚖️</Text>
              <Text style={[styles.actionLabel, { color: theme.colors.white }]}>
                Log Weight
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.gray800 }]}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={[styles.actionLabel, { color: theme.colors.white }]}>
                View Progress
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.gray800 }]}
              onPress={handleSeedDatabase}
              disabled={isSeeding}
            >
              {isSeeding ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Text style={styles.actionIcon}>�</Text>
              )}
              <Text style={[styles.actionLabel, { color: theme.colors.white }]}>
                {isSeeding ? 'Seeding...' : 'Seed Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            Recent Activity
          </Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Text style={[styles.activityIcon, { color: theme.colors.white }]}>💪</Text>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.white }]}>
                  Completed Leg Day
                </Text>
                <Text style={[styles.activityTime, { color: theme.colors.gray400 }]}>
                  Yesterday, 6:30 PM
                </Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Text style={[styles.activityIcon, { color: theme.colors.white }]}>🍽️</Text>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.white }]}>
                  Logged Nigerian jollof rice
                </Text>
                <Text style={[styles.activityTime, { color: theme.colors.gray400 }]}>
                  Yesterday, 2:15 PM
                </Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Text style={[styles.activityIcon, { color: theme.colors.white }]}>⚖️</Text>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.white }]}>
                  Weight update: 70.5 kg
                </Text>
                <Text style={[styles.activityTime, { color: theme.colors.gray400 }]}>
                  2 days ago
                </Text>
              </View>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 20,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  workoutCard: {
    padding: 20,
    borderRadius: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  workoutDuration: {
    fontSize: 14,
    marginLeft: 12,
  },
  workoutDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
  },
});

export default HomeScreen;