import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { useTheme } from '@/constants/theme';
import { OnboardingStackParamList, UserProfile } from '@/types';
import { AppDispatch } from '@/store';
import { updateOnboardingData } from '@/store/slices/onboardingSlice';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

type ActivityLevelScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'ActivityLevel'>;

interface ActivityOption {
  id: UserProfile['activityLevel'];
  title: string;
  description: string;
  nigerianExample: string;
  icon: string;
}

const activityOptions: ActivityOption[] = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    description: 'Little to no exercise, mostly sitting',
    nigerianExample: 'Office work in VI, minimal movement',
    icon: '💻',
  },
  {
    id: 'light',
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days per week',
    nigerianExample: 'Weekend jogging in Tafawa Balewa Square',
    icon: '🚶',
  },
  {
    id: 'moderate',
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days per week',
    nigerianExample: 'Regular gym visits after work',
    icon: '🏃',
  },
  {
    id: 'active',
    title: 'Very Active',
    description: 'Hard exercise 6-7 days per week',
    nigerianExample: 'Daily workouts + weekend football',
    icon: '🏋️',
  },
  {
    id: 'very_active',
    title: 'Extremely Active',
    description: 'Very hard exercise, physical job, or training',
    nigerianExample: 'Personal trainer or construction work',
    icon: '🥇',
  },
];

const ActivityLevelScreen: React.FC = () => {
  const navigation = useNavigation<ActivityLevelScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [selectedLevel, setSelectedLevel] = useState<UserProfile['activityLevel'] | null>(null);

  const handleContinue = () => {
    if (!selectedLevel) return;
    // TODO: Save to Redux store
    navigation.navigate('WorkoutPreferences');
  };

  const ActivityCard = ({ activity }: { activity: ActivityOption }) => (
    <TouchableOpacity
      style={[
        styles.activityCard,
        {
          borderColor: selectedLevel === activity.id ? theme.colors.white : theme.colors.gray600,
          backgroundColor: selectedLevel === activity.id ? theme.colors.gray800 : 'transparent',
        }
      ]}
      onPress={() => setSelectedLevel(activity.id)}
    >
      <View style={styles.activityHeader}>
        <Text style={[styles.activityIcon, { color: theme.colors.white }]}>
          {activity.icon}
        </Text>
        <View style={styles.activityContent}>
          <Text style={[
            styles.activityTitle,
            { 
              color: selectedLevel === activity.id ? theme.colors.white : theme.colors.gray200,
              fontWeight: selectedLevel === activity.id ? '600' : '500',
            }
          ]}>
            {activity.title}
          </Text>
          <Text style={[styles.activityDescription, { color: theme.colors.gray300 }]}>
            {activity.description}
          </Text>
          <Text style={[styles.nigerianExample, { color: theme.colors.gray400 }]}>
            {activity.nigerianExample}
          </Text>
        </View>
        {selectedLevel === activity.id && (
          <Text style={[styles.selectedIndicator, { color: theme.colors.white }]}>
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.white }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          
          <ProgressIndicator
            currentStep={5}
            totalSteps={7}
            style={styles.progressIndicator}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            How active are you?
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            This helps us estimate your daily calorie burn and adjust your workout intensity.
          </Text>

          <ScrollView 
            style={styles.activitiesList}
            showsVerticalScrollIndicator={false}
          >
            {activityOptions.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedLevel}
            style={styles.continueButton}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressIndicator: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  activitiesList: {
    flex: 1,
  },
  activityCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    fontSize: 28,
    marginRight: 16,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  nigerianExample: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  selectedIndicator: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    marginBottom: 32,
    marginTop: 16,
  },
  continueButton: {
    marginTop: 8,
  },
});

export default ActivityLevelScreen;