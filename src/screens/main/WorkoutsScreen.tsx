import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import { workoutGenerationService } from '@/services/workoutGenerationService';
import { userDataService } from '@/services/userDataService';
import { RootState } from '@/store';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  equipment?: string[];
  completed: boolean;
}

interface DailyWorkout {
  day: string;
  exercises: Exercise[];
}

const WorkoutsScreen: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [weeklyPlan, setWeeklyPlan] = useState<DailyWorkout[]>([]);
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  
  // Get user profile and auth for personalization
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    generatePersonalizedPlan();
  }, [userProfile]);

  useEffect(() => {
    // Load progress when selected day changes
    if (userId && selectedDay) {
      loadProgressForDay(selectedDay);
    }
  }, [selectedDay, userId]);

  const loadProgressForDay = async (day: string) => {
    if (!userId) return;
    
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}_${day}`;
      const progress = await userDataService.loadWorkoutProgress(userId, dateStr);
      setCompletedExercises(progress);
    } catch (error) {
      console.error('Error loading workout progress:', error);
    }
  };

  const generatePersonalizedPlan = () => {
    if (!userProfile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const selectedDays = userProfile.selectedWorkoutDays || [];
      const equipment = userProfile.fitnessGoal;
      const goal = userProfile.fitnessGoal;
      
      // Generate workout plan based on user's goal and equipment
      const workoutRecommendations = workoutGenerationService.generateWorkoutsForUser(userProfile);
      
      // Create daily workout plans for selected days
      const plan: DailyWorkout[] = selectedDays.map((day, index) => {
        const workout = workoutRecommendations[index % workoutRecommendations.length];
        
        return {
          day,
          exercises: generateExercisesForWorkout(workout, userProfile)
        };
      });
      
      setWeeklyPlan(plan);
      
      // Set first selected day as default
      if (plan.length > 0) {
        setSelectedDay(plan[0].day);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error generating plan:', error);
      setLoading(false);
    }
  };

  const generateExercisesForWorkout = (workout: any, profile: any): Exercise[] => {
    const { fitnessGoal, equipmentLevel } = profile;
    
    // Define exercises based on goal and equipment
    const exerciseDatabase: { [key: string]: any } = {
      // Home workouts (no equipment)
      home_lose_belly_fat: [
        { name: 'Burpees', sets: 3, reps: '10-15', restSeconds: 60, instructions: 'Jump down to plank, push-up, jump back up. Full body explosive movement.' },
        { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', restSeconds: 45, instructions: 'In plank position, drive knees to chest alternately at high speed.' },
        { name: 'High Knees', sets: 3, reps: '30 seconds', restSeconds: 45, instructions: 'Run in place bringing knees up to hip level.' },
        { name: 'Jumping Jacks', sets: 3, reps: '20-30', restSeconds: 30, instructions: 'Jump feet apart while raising arms overhead, return to start.' },
        { name: 'Plank Hold', sets: 3, reps: '30-60 seconds', restSeconds: 60, instructions: 'Hold straight body position on forearms and toes.' },
      ],
      home_build_muscle: [
        { name: 'Push-ups', sets: 4, reps: '12-15', restSeconds: 60, instructions: 'Hands shoulder-width, lower chest to ground, push back up.' },
        { name: 'Bodyweight Squats', sets: 4, reps: '15-20', restSeconds: 60, instructions: 'Feet shoulder-width, squat down until thighs parallel to ground.' },
        { name: 'Pike Push-ups', sets: 3, reps: '10-12', restSeconds: 60, instructions: 'Downward dog position, bend elbows to lower head toward ground.' },
        { name: 'Lunges', sets: 3, reps: '12 each leg', restSeconds: 60, instructions: 'Step forward, lower back knee toward ground, push back up.' },
        { name: 'Diamond Push-ups', sets: 3, reps: '8-12', restSeconds: 60, instructions: 'Hands together forming diamond shape, perform push-ups.' },
      ],
      // Gym workouts
      gym_lose_belly_fat: [
        { name: 'Treadmill HIIT', sets: 1, reps: '20 minutes', restSeconds: 0, instructions: '30 seconds sprint, 30 seconds walk. Repeat for 20 minutes.', equipment: ['treadmill'] },
        { name: 'Dumbbell Thrusters', sets: 4, reps: '12-15', restSeconds: 60, instructions: 'Squat with dumbbells at shoulders, stand and press overhead.', equipment: ['dumbbells'] },
        { name: 'Kettlebell Swings', sets: 4, reps: '15-20', restSeconds: 45, instructions: 'Swing kettlebell from between legs to shoulder height using hips.', equipment: ['kettlebell'] },
        { name: 'Cable Woodchops', sets: 3, reps: '12 each side', restSeconds: 45, instructions: 'Pull cable diagonally across body, engaging core.', equipment: ['cable machine'] },
        { name: 'Battle Ropes', sets: 4, reps: '30 seconds', restSeconds: 60, instructions: 'Wave heavy ropes up and down alternately or together.' },
      ],
      gym_build_muscle: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-12', restSeconds: 90, instructions: 'Lie on bench, lower bar to chest, press back up.', equipment: ['barbell', 'bench'] },
        { name: 'Barbell Squats', sets: 4, reps: '8-12', restSeconds: 90, instructions: 'Bar on upper back, squat down, drive back up through heels.', equipment: ['barbell', 'squat rack'] },
        { name: 'Dumbbell Rows', sets: 4, reps: '10-12 each arm', restSeconds: 60, instructions: 'Bent over, pull dumbbell to hip, lower with control.', equipment: ['dumbbells'] },
        { name: 'Overhead Press', sets: 4, reps: '8-10', restSeconds: 90, instructions: 'Press dumbbells or barbell from shoulders to overhead.', equipment: ['dumbbells'] },
        { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', restSeconds: 90, instructions: 'Hip hinge with slight knee bend, lower bar to mid-shin.', equipment: ['barbell'] },
      ],
      gym_strength_training: [
        { name: 'Deadlifts', sets: 5, reps: '5', restSeconds: 180, instructions: 'Lift bar from ground to standing, keep back straight.', equipment: ['barbell'] },
        { name: 'Barbell Bench Press', sets: 5, reps: '5', restSeconds: 180, instructions: 'Heavy bench press for maximum strength.', equipment: ['barbell', 'bench'] },
        { name: 'Barbell Squats', sets: 5, reps: '5', restSeconds: 180, instructions: 'Heavy back squats, focus on depth and form.', equipment: ['barbell', 'squat rack'] },
        { name: 'Overhead Press', sets: 4, reps: '6-8', restSeconds: 120, instructions: 'Press heavy weight overhead from shoulders.', equipment: ['barbell'] },
        { name: 'Barbell Rows', sets: 4, reps: '6-8', restSeconds: 120, instructions: 'Bent over row with heavy weight.', equipment: ['barbell'] },
      ],
    };

    // Determine which exercise set to use
    let exerciseKey = '';
    
    if (equipmentLevel === 'home') {
      if (fitnessGoal === 'lose_belly_fat') exerciseKey = 'home_lose_belly_fat';
      else if (fitnessGoal === 'build_muscle' || fitnessGoal === 'build_lean_mass') exerciseKey = 'home_build_muscle';
      else exerciseKey = 'home_lose_belly_fat'; // default
    } else {
      if (fitnessGoal === 'lose_belly_fat') exerciseKey = 'gym_lose_belly_fat';
      else if (fitnessGoal === 'build_muscle' || fitnessGoal === 'build_lean_mass') exerciseKey = 'gym_build_muscle';
      else if (fitnessGoal === 'strength_training') exerciseKey = 'gym_strength_training';
      else exerciseKey = 'gym_build_muscle'; // default
    }

    const exercises = exerciseDatabase[exerciseKey] || exerciseDatabase['home_lose_belly_fat'];
    
    return exercises.map((ex: any, index: number) => ({
      id: `ex-${index}`,
      ...ex,
      completed: false,
    }));
  };

  const toggleExerciseComplete = async (exerciseId: string) => {
    const newCompletedState = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId]
    };
    
    setCompletedExercises(newCompletedState);
    
    // Save to Firebase
    if (userId && selectedDay) {
      try {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}_${selectedDay}`;
        await userDataService.saveWorkoutProgress(userId, dateStr, newCompletedState);
      } catch (error) {
        console.error('Error saving workout progress:', error);
      }
    }
  };

  const getCurrentDayWorkout = () => {
    return weeklyPlan.find(plan => plan.day === selectedDay);
  };

  const calculateProgress = () => {
    const currentWorkout = getCurrentDayWorkout();
    if (!currentWorkout) return 0;
    
    const totalExercises = currentWorkout.exercises.length;
    const completed = currentWorkout.exercises.filter(ex => completedExercises[ex.id]).length;
    
    return totalExercises > 0 ? (completed / totalExercises) * 100 : 0;
  };

  const isWorkoutDay = (day: string) => {
    return weeklyPlan.some(plan => plan.day === day);
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.white} />
          <Text style={[styles.loadingText, { color: theme.colors.white }]}>
            Creating your personalized plan...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!userProfile || weeklyPlan.length === 0) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.colors.white }]}>
            No Workout Plan Yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.gray400 }]}>
            Complete your onboarding to get a personalized workout plan based on your goals.
          </Text>
        </View>
      </Screen>
    );
  }

  const currentWorkout = getCurrentDayWorkout();
  const progress = calculateProgress();

  return (
    <Screen padding={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Your Workout Plan
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray400 }]}>
            {userProfile.fitnessGoal.replace(/_/g, ' ').charAt(0).toUpperCase() + userProfile.fitnessGoal.replace(/_/g, ' ').slice(1)} • {userProfile.workoutDaysPerWeek} days/week
          </Text>
        </View>

        {/* Week Day Selector */}
        <View style={styles.weekContainer}>
          <View style={styles.daysRow}>
            {daysOfWeek.map((day, index) => {
              const isSelected = selectedDay === day;
              const isActiveDay = isWorkoutDay(day);
              
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    isActiveDay
                      ? isSelected
                        ? { backgroundColor: theme.colors.white, borderColor: theme.colors.white }
                        : { backgroundColor: 'transparent', borderColor: theme.colors.gray500 }
                      : { backgroundColor: theme.colors.black, borderColor: theme.colors.gray800, opacity: 0.4 }
                  ]}
                  onPress={() => isActiveDay && setSelectedDay(day)}
                  disabled={!isActiveDay}
                >
                  <Text style={[
                    styles.dayText,
                    { color: isSelected && isActiveDay ? theme.colors.black : theme.colors.white }
                  ]}>
                    {daysShort[index]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.selectedDayLabel, { color: theme.colors.gray400 }]}>
            {selectedDay} Workout
          </Text>
        </View>

        {/* Progress Bar */}
        {currentWorkout && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: theme.colors.white }]}>
                Today's Progress
              </Text>
              <Text style={[styles.progressPercent, { color: theme.colors.white }]}>
                {Math.round(progress)}%
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: theme.colors.gray700 }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    backgroundColor: theme.colors.white,
                    width: `${progress}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressSubtext, { color: theme.colors.gray400 }]}>
              {currentWorkout.exercises.filter(ex => completedExercises[ex.id]).length} of {currentWorkout.exercises.length} exercises completed
            </Text>
          </View>
        )}

        {/* Exercise List */}
        {currentWorkout ? (
          <View style={styles.exercisesContainer}>
            <Text style={[styles.exercisesTitle, { color: theme.colors.white }]}>
              Exercises
            </Text>
            {currentWorkout.exercises.map((exercise, index) => (
              <View 
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  { backgroundColor: theme.colors.gray800 },
                  completedExercises[exercise.id] && { opacity: 0.6 }
                ]}
              >
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseNumber, { color: theme.colors.gray400 }]}>
                      #{index + 1}
                    </Text>
                    <View style={styles.exerciseDetails}>
                      <Text style={[styles.exerciseName, { color: theme.colors.white }]}>
                        {exercise.name}
                      </Text>
                      <Text style={[styles.exerciseMeta, { color: theme.colors.gray400 }]}>
                        {exercise.sets} sets × {exercise.reps} reps • Rest: {exercise.restSeconds}s
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      { borderColor: theme.colors.gray400 },
                      completedExercises[exercise.id] && { 
                        backgroundColor: theme.colors.white,
                        borderColor: theme.colors.white
                      }
                    ]}
                    onPress={() => toggleExerciseComplete(exercise.id)}
                  >
                    {completedExercises[exercise.id] && (
                      <Text style={[styles.checkmark, { color: theme.colors.black }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={[styles.exerciseInstructions, { color: theme.colors.gray300 }]}>
                  {exercise.instructions}
                </Text>
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <View style={styles.equipmentTags}>
                    {exercise.equipment.map((eq, idx) => (
                      <View 
                        key={idx}
                        style={[styles.equipmentTag, { backgroundColor: theme.colors.gray700 }]}
                      >
                        <Text style={[styles.equipmentText, { color: theme.colors.gray300 }]}>
                          {eq}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.restDayContainer}>
            <Text style={[styles.restDayTitle, { color: theme.colors.white }]}>
              Rest Day
            </Text>
            <Text style={[styles.restDayText, { color: theme.colors.gray400 }]}>
              No workout scheduled for {selectedDay}. Recovery is important!
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  weekContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedDayLabel: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
  },
  exercisesContainer: {
    paddingHorizontal: 16,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    marginTop: 2,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseMeta: {
    fontSize: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseInstructions: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  equipmentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  equipmentTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  equipmentText: {
    fontSize: 11,
    fontWeight: '500',
  },
  restDayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  restDayEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  restDayTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  restDayText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  },
});

export default WorkoutsScreen;