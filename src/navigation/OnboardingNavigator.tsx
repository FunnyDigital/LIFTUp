import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/types';

import OnboardingWelcomeScreen from '@/screens/onboarding/OnboardingWelcomeScreen';
import PersonalInfoScreen from '@/screens/onboarding/PersonalInfoScreen';
import BodyMetricsScreen from '@/screens/onboarding/BodyMetricsScreen';
import FitnessGoalsScreen from '@/screens/onboarding/FitnessGoalsScreen';
import ActivityLevelScreen from '@/screens/onboarding/ActivityLevelScreen';
import WorkoutPreferencesScreen from '@/screens/onboarding/WorkoutPreferencesScreen';
import OnboardingSummaryScreen from '@/screens/onboarding/OnboardingSummaryScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Welcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="BodyMetrics" component={BodyMetricsScreen} />
      <Stack.Screen name="FitnessGoals" component={FitnessGoalsScreen} />
      <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
      <Stack.Screen name="WorkoutPreferences" component={WorkoutPreferencesScreen} />
      <Stack.Screen name="Summary" component={OnboardingSummaryScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;