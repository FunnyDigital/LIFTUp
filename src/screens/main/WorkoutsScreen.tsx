import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import { workoutService } from '@/services/workoutService';
import { workoutGenerationService } from '@/services/workoutGenerationService';
import { Workout } from '@/types';
import { RootState } from '@/store';

const WorkoutsScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user profile for personalization
  const userProfile = useSelector((state: RootState) => state.user.profile);

  const categories = ['All', 'Recommended', 'Strength', 'Cardio', 'Flexibility', 'HIIT'];

  useEffect(() => {
    loadWorkouts();
  }, [selectedCategory]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If user has profile and "Recommended" category is selected, show personalized workouts
      if (selectedCategory === 'Recommended' && userProfile) {
        const personalizedWorkouts = workoutGenerationService.generateWorkoutsForUser(userProfile);
        setWorkouts(personalizedWorkouts);
        setLoading(false);
        return;
      }
      
      // Otherwise try to load from Firestore
      const filters: any = {};
      if (selectedCategory !== 'All' && selectedCategory !== 'Recommended') {
        // Map category to difficulty or equipment as needed
        if (selectedCategory === 'Strength') {
          filters.equipment = ['barbell', 'dumbbells', 'kettlebell'];
        } else if (selectedCategory === 'Cardio') {
          filters.muscleGroups = ['full_body', 'legs'];
        }
      }
      
      const data = await workoutService.getWorkouts(filters);
      
      if (data.length === 0 && userProfile) {
        // If no workouts in Firestore, show personalized workouts as fallback
        const personalizedWorkouts = workoutGenerationService.generateWorkoutsForUser(userProfile);
        setWorkouts(personalizedWorkouts);
      } else {
        setWorkouts(data);
      }
    } catch (err) {
      console.error('Error loading workouts:', err);
      setError('Failed to load workouts from database.');
      
      // Fallback to personalized workouts if user has profile
      if (userProfile) {
        const personalizedWorkouts = workoutGenerationService.generateWorkoutsForUser(userProfile);
        setWorkouts(personalizedWorkouts);
      } else {
        // Fallback to sample data if no profile
        setWorkouts([
          {
            name: 'Lagos Streets HIIT 🏃',
            description: 'High-intensity workout inspired by the hustle of Lagos streets.',
            muscleGroups: ['full_body'],
            durationMinutes: 20,
            exercises: [],
            instructions: 'High-intensity workout inspired by the hustle of Lagos streets.',
            difficulty: 'intermediate',
            equipment: [],
          },
          {
            name: 'Afrobeats Dance Cardio 💃',
            description: 'Fun cardio workout featuring popular Nigerian dance moves.',
            muscleGroups: ['full_body', 'legs'],
            durationMinutes: 30,
            exercises: [],
            instructions: 'Fun cardio workout featuring popular Nigerian dance moves.',
            difficulty: 'beginner',
            equipment: [],
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = (workout: any) => {
    Alert.alert(
      'Start Workout',
      `Ready to start "${workout.name}"?\n\nDuration: ${workout.durationMinutes} minutes\nLevel: ${workout.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // TODO: Navigate to workout session screen
            Alert.alert('Workout Started!', 'Workout session feature coming soon!');
          }
        },
      ]
    );
  };

  const WorkoutCard = ({ workout }: { workout: any }) => {
    const getWorkoutIcon = (name: string) => {
      if (name.toLowerCase().includes('lagos') || name.toLowerCase().includes('hiit')) return '💨';
      if (name.toLowerCase().includes('afrobeats') || name.toLowerCase().includes('dance')) return '💃';
      if (name.toLowerCase().includes('strength') || name.toLowerCase().includes('muscle')) return '💪';
      return '🏋️';
    };

    const getEquipmentText = (equipment: string[]) => {
      if (equipment.length === 0) return 'No Equipment';
      if (equipment.includes('barbell') || equipment.includes('dumbbells')) return 'Full Gym';
      return 'Basic Equipment';
    };

    return (
      <TouchableOpacity 
        style={[styles.workoutCard, { backgroundColor: theme.colors.gray800 }]}
        onPress={() => handleStartWorkout(workout)}
      >
        <View style={styles.workoutHeader}>
          <Text style={[styles.workoutIcon, { color: theme.colors.white }]}>
            {getWorkoutIcon(workout.name)}
          </Text>
          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutTitle, { color: theme.colors.white }]}>
              {workout.name}
            </Text>
            <Text style={[styles.workoutDescription, { color: theme.colors.gray400 }]}>
              {workout.instructions}
            </Text>
          </View>
        </View>
        
        <View style={styles.workoutMeta}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: theme.colors.gray400 }]}>Duration</Text>
            <Text style={[styles.metaValue, { color: theme.colors.white }]}>{workout.durationMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: theme.colors.gray400 }]}>Level</Text>
            <Text style={[styles.metaValue, { color: theme.colors.white }]}>
              {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: theme.colors.gray400 }]}>Equipment</Text>
            <Text style={[styles.metaValue, { color: theme.colors.white }]}>
              {getEquipmentText(workout.equipment)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.startWorkoutButton, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.startWorkoutText, { color: theme.colors.black }]}>
            Start Workout
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.white} />
          <Text style={[styles.loadingText, { color: theme.colors.white }]}>
            Loading Nigerian workouts...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Workouts 💪
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            {selectedCategory === 'Recommended' && userProfile
              ? `Personalized for your ${userProfile.fitnessGoal.replace(/_/g, ' ')} goal`
              : 'Nigerian-inspired fitness routines'
            }
          </Text>
          {error && (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadWorkouts}
            >
              <Text style={[styles.retryText, { color: theme.colors.white }]}>
                ⟲ Retry Loading
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categories}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category 
                    ? theme.colors.white 
                    : theme.colors.gray800,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                {
                  color: selectedCategory === category 
                    ? theme.colors.black 
                    : theme.colors.white,
                }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Workouts List */}
        <ScrollView 
          style={styles.workoutsList}
          showsVerticalScrollIndicator={false}
        >
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.gray400 }]}>
                {error 
                  ? 'Failed to load workouts' 
                  : userProfile 
                    ? 'No workouts found for this category'
                    : 'Complete your profile to get personalized workouts'
                }
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.colors.gray500 }]}>
                {userProfile 
                  ? 'Try selecting a different category or check back later'
                  : 'Go to Profile → Edit Profile to set your fitness goals'
                }
              </Text>
            </View>
          ) : (
            workouts.map((workout, index) => (
              <WorkoutCard key={workout.id || index} workout={workout} />
            ))
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  retryButton: {
    marginTop: 8,
    padding: 8,
  },
  retryText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categories: {
    paddingRight: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutsList: {
    flex: 1,
  },
  workoutCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  startWorkoutButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startWorkoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WorkoutsScreen;