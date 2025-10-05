import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import { RootState } from '@/store';
import { workoutGenerationService } from '@/services/workoutGenerationService';

const CalendarScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get real user data from Redux
  const userProfile = useSelector((state: RootState) => state.user.profile);
  
  // Real calendar data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Mock scheduled workouts
  const scheduledWorkouts = {
    '2024-01-15': 'Push Day',
    '2024-01-17': 'Pull Day', 
    '2024-01-19': 'Leg Day',
    '2024-01-22': 'Cardio',
    '2024-01-24': 'Push Day',
  };
  
  // Generate today's workout based on user profile
  const todaysWorkout = userProfile ? workoutGenerationService.getTodaysWorkout(userProfile) : null;
  
  const todaysWorkouts = todaysWorkout ? [
    {
      id: 1,
      time: '6:00 AM',
      title: todaysWorkout.name,
      duration: `${todaysWorkout.durationMinutes} min`,
      completed: false,
    },
    {
      id: 2,
      time: '12:00 PM',
      title: 'Meal: Nigerian lunch',
      duration: '30 min',
      completed: false,
      type: 'meal',
    },
  ] : [
    {
      id: 1,
      time: 'TBD',
      title: 'Complete your profile to see personalized workouts',
      duration: '0 min',
      completed: false,
    },
  ];
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasWorkout = scheduledWorkouts[dateString];
      const isToday = day === currentDate.getDate();
      const isSelected = day === selectedDate.getDate();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            isSelected && { backgroundColor: theme.colors.white },
            isToday && !isSelected && { borderColor: theme.colors.white, borderWidth: 1 },
          ]}
          onPress={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          <Text style={[
            styles.dayText,
            { color: isSelected ? theme.colors.black : theme.colors.white },
            isToday && !isSelected && { color: theme.colors.white },
          ]}>
            {day}
          </Text>
          {hasWorkout && (
            <View style={[
              styles.workoutDot,
              { backgroundColor: isSelected ? theme.colors.black : theme.colors.white }
            ]} />
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  const WorkoutItem = ({ workout }: { workout: typeof todaysWorkouts[0] }) => (
    <TouchableOpacity style={[
      styles.workoutItem,
      { backgroundColor: theme.colors.gray800 },
      workout.completed && { opacity: 0.6 }
    ]}>
      <View style={styles.workoutTime}>
        <Text style={[styles.timeText, { color: theme.colors.white }]}>
          {workout.time}
        </Text>
      </View>
      
      <View style={styles.workoutDetails}>
        <View style={styles.workoutHeader}>
          <Text style={[
            styles.workoutTitle,
            { color: theme.colors.white },
            workout.completed && { textDecorationLine: 'line-through' }
          ]}>
            {workout.title}
          </Text>
          {workout.completed && (
            <Text style={[styles.completedIcon, { color: theme.colors.white }]}>
              ✓
            </Text>
          )}
        </View>
        <Text style={[styles.workoutDuration, { color: theme.colors.gray400 }]}>
          {workout.duration}
        </Text>
      </View>
      
      <View style={styles.workoutTypeIcon}>
        <Text style={[styles.typeEmoji, { color: theme.colors.white }]}>
          {workout.type === 'meal' ? '🍽️' : workout.type === 'cardio' ? '🏃' : '💪'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Calendar 📅
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            Plan your fitness journey
          </Text>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarContainer, { backgroundColor: theme.colors.gray800 }]}>
          <Text style={[styles.monthYear, { color: theme.colors.white }]}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          
          <View style={styles.weekDays}>
            {dayNames.map((day) => (
              <Text key={day} style={[styles.weekDayText, { color: theme.colors.gray400 }]}>
                {day}
              </Text>
            ))}
          </View>
          
          <View style={styles.daysGrid}>
            {renderCalendarDays()}
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            Today's Schedule
          </Text>
          
          {todaysWorkouts.map((workout) => (
            <WorkoutItem key={workout.id} workout={workout} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.black }]}>
              + Schedule Workout
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.gray800 }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
              View Week
            </Text>
          </TouchableOpacity>
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
  calendarContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    width: 35,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emptyDay: {
    width: 35,
    height: 35,
    margin: 2,
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 2,
  },
  scheduleSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  workoutTime: {
    width: 70,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutDetails: {
    flex: 1,
    marginLeft: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  completedIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  workoutDuration: {
    fontSize: 14,
    marginTop: 2,
  },
  workoutTypeIcon: {
    marginLeft: 12,
  },
  typeEmoji: {
    fontSize: 20,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalendarScreen;