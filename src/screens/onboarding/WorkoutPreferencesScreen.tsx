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
import { OnboardingStackParamList } from '@/types';
import { AppDispatch } from '@/store';
import { updateOnboardingData } from '@/store/slices/onboardingSlice';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

type WorkoutPreferencesScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'WorkoutPreferences'>;

interface EquipmentOption {
  id: 'home' | 'basic_gym' | 'full_gym';
  title: string;
  description: string;
  nigerianContext: string;
  icon: string;
}

const equipmentOptions: EquipmentOption[] = [
  {
    id: 'home',
    title: 'Home Workouts',
    description: 'Bodyweight exercises, minimal equipment',
    nigerianContext: 'Perfect for small Lagos apartments',
    icon: '🏠',
  },
  {
    id: 'basic_gym',
    title: 'Basic Gym',
    description: 'Basic weights, cardio machines',
    nigerianContext: 'Local neighborhood gym setup',
    icon: '🏋️‍♀️',
  },
  {
    id: 'full_gym',
    title: 'Full Gym',
    description: 'Complete equipment, machines, free weights',
    nigerianContext: 'Premium gyms in VI or GRA',
    icon: '🏋️',
  },
];

const workoutDaysOptions = [
  { value: 2, label: '2 days', description: 'Weekend warrior' },
  { value: 3, label: '3 days', description: 'Good balance' },
  { value: 4, label: '4 days', description: 'Very committed' },
  { value: 5, label: '5 days', description: 'Dedicated athlete' },
  { value: 6, label: '6 days', description: 'Fitness enthusiast' },
  { value: 7, label: '7 days', description: 'Fitness lifestyle' },
];

const WorkoutPreferencesScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutPreferencesScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [preferences, setPreferences] = useState({
    workoutDaysPerWeek: 3,
    equipmentLevel: null as EquipmentOption['id'] | null,
    location: 'Lagos, Nigeria',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!preferences.equipmentLevel) {
      newErrors.equipmentLevel = 'Please select your equipment preference';
    }

    if (!preferences.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    
    // Save workout preferences to Redux
    dispatch(updateOnboardingData({
      workoutDaysPerWeek: preferences.workoutDaysPerWeek,
      equipmentLevel: preferences.equipmentLevel as 'home' | 'basic_gym' | 'full_gym',
      location: preferences.location.trim(),
    }));
    
    navigation.navigate('Summary');
  };

  const EquipmentCard = ({ equipment }: { equipment: EquipmentOption }) => (
    <TouchableOpacity
      style={[
        styles.equipmentCard,
        {
          borderColor: preferences.equipmentLevel === equipment.id ? theme.colors.white : theme.colors.gray600,
          backgroundColor: preferences.equipmentLevel === equipment.id ? theme.colors.gray800 : 'transparent',
        }
      ]}
      onPress={() => {
        setPreferences(prev => ({ ...prev, equipmentLevel: equipment.id }));
        if (errors.equipmentLevel) {
          setErrors(prev => ({ ...prev, equipmentLevel: '' }));
        }
      }}
    >
      <View style={styles.equipmentHeader}>
        <Text style={[styles.equipmentIcon, { color: theme.colors.white }]}>
          {equipment.icon}
        </Text>
        <View style={styles.equipmentContent}>
          <Text style={[
            styles.equipmentTitle,
            { 
              color: preferences.equipmentLevel === equipment.id ? theme.colors.white : theme.colors.gray200,
              fontWeight: preferences.equipmentLevel === equipment.id ? '600' : '500',
            }
          ]}>
            {equipment.title}
          </Text>
          <Text style={[styles.equipmentDescription, { color: theme.colors.gray300 }]}>
            {equipment.description}
          </Text>
          <Text style={[styles.nigerianContext, { color: theme.colors.gray400 }]}>
            {equipment.nigerianContext}
          </Text>
        </View>
        {preferences.equipmentLevel === equipment.id && (
          <Text style={[styles.selectedIndicator, { color: theme.colors.white }]}>
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const WorkoutDaysSelector = () => (
    <View style={styles.workoutDaysContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
        Workout Days Per Week
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.workoutDaysScroll}
      >
        {workoutDaysOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.workoutDayOption,
              {
                borderColor: preferences.workoutDaysPerWeek === option.value ? theme.colors.white : theme.colors.gray600,
                backgroundColor: preferences.workoutDaysPerWeek === option.value ? theme.colors.white : 'transparent',
              }
            ]}
            onPress={() => setPreferences(prev => ({ ...prev, workoutDaysPerWeek: option.value }))}
          >
            <Text style={[
              styles.workoutDayLabel,
              { 
                color: preferences.workoutDaysPerWeek === option.value ? theme.colors.black : theme.colors.white,
                fontWeight: preferences.workoutDaysPerWeek === option.value ? '600' : '500',
              }
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.workoutDayDescription,
              { color: preferences.workoutDaysPerWeek === option.value ? theme.colors.gray700 : theme.colors.gray400 }
            ]}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Screen scrollable keyboardAvoiding>
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
            currentStep={6}
            totalSteps={7}
            style={styles.progressIndicator}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Workout preferences
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            Tell us about your workout schedule and available equipment.
          </Text>

          <View style={styles.form}>
            <WorkoutDaysSelector />

            <View style={styles.equipmentSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
                Available Equipment
              </Text>
              {equipmentOptions.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
              {errors.equipmentLevel && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.equipmentLevel}
                </Text>
              )}
            </View>

            <Input
              label="Location (City, State)"
              placeholder="e.g., Lagos, Nigeria"
              value={preferences.location}
              onChangeText={(value) => {
                setPreferences(prev => ({ ...prev, location: value }));
                if (errors.location) {
                  setErrors(prev => ({ ...prev, location: '' }));
                }
              }}
              leftIcon="map-pin"
              error={errors.location}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Continue"
            onPress={handleContinue}
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
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  workoutDaysContainer: {
    marginBottom: 32,
  },
  workoutDaysScroll: {
    flexDirection: 'row',
  },
  workoutDayOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  workoutDayLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  workoutDayDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  equipmentSection: {
    marginBottom: 24,
  },
  equipmentCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  equipmentIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  equipmentContent: {
    flex: 1,
  },
  equipmentTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  equipmentDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 2,
  },
  nigerianContext: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  selectedIndicator: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    marginBottom: 32,
    marginTop: 16,
  },
  continueButton: {
    marginTop: 8,
  },
});

export default WorkoutPreferencesScreen;