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
import { OnboardingStackParamList, FitnessGoal } from '@/types';
import { AppDispatch } from '@/store';
import { updateOnboardingData } from '@/store/slices/onboardingSlice';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

type FitnessGoalsScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FitnessGoals'>;

interface GoalOption {
  id: FitnessGoal;
  title: string;
  description: string;
  icon: string;
  nigerianContext: string;
}

const goalOptions: GoalOption[] = [
  {
    id: 'lose_belly_fat',
    title: 'Lose Belly Fat',
    description: 'Reduce abdominal fat and get a flatter stomach',
    icon: '🔥',
    nigerianContext: 'Perfect for busy Lagos professionals',
  },
  {
    id: 'build_muscle',
    title: 'Build Muscle',
    description: 'Gain lean muscle mass and increase strength',
    icon: '💪',
    nigerianContext: 'Build that strong Nigerian physique',
  },
  {
    id: 'build_lean_mass',
    title: 'Build Lean Mass',
    description: 'Add muscle while staying lean and defined',
    icon: '⚡',
    nigerianContext: 'Athletic build for active lifestyles',
  },
  {
    id: 'improve_cardio',
    title: 'Improve Cardio',
    description: 'Boost endurance and heart health',
    icon: '❤️',
    nigerianContext: 'Better stamina for daily activities',
  },
  {
    id: 'strength_training',
    title: 'Strength Training',
    description: 'Build raw power and functional strength',
    icon: '🏋️',
    nigerianContext: 'Functional strength for everyday tasks',
  },
  {
    id: 'weight_maintenance',
    title: 'Weight Maintenance',
    description: 'Maintain current weight while staying active',
    icon: '⚖️',
    nigerianContext: 'Stay healthy and energized',
  },
];

const FitnessGoalsScreen: React.FC = () => {
  const navigation = useNavigation<FitnessGoalsScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);

  const handleContinue = () => {
    if (!selectedGoal) return;
    // TODO: Save to Redux store
    navigation.navigate('ActivityLevel');
  };

  const GoalCard = ({ goal }: { goal: GoalOption }) => (
    <TouchableOpacity
      style={[
        styles.goalCard,
        {
          borderColor: selectedGoal === goal.id ? theme.colors.white : theme.colors.gray600,
          backgroundColor: selectedGoal === goal.id ? theme.colors.gray800 : 'transparent',
        }
      ]}
      onPress={() => setSelectedGoal(goal.id)}
    >
      <View style={styles.goalHeader}>
        <Text style={[styles.goalIcon, { color: theme.colors.white }]}>
          {goal.icon}
        </Text>
        <View style={styles.goalTitleContainer}>
          <Text style={[
            styles.goalTitle,
            { 
              color: selectedGoal === goal.id ? theme.colors.white : theme.colors.gray200,
              fontWeight: selectedGoal === goal.id ? '600' : '500',
            }
          ]}>
            {goal.title}
          </Text>
          <Text style={[styles.goalDescription, { color: theme.colors.gray300 }]}>
            {goal.description}
          </Text>
        </View>
        {selectedGoal === goal.id && (
          <Text style={[styles.selectedIndicator, { color: theme.colors.white }]}>
            ✓
          </Text>
        )}
      </View>
      
      <Text style={[styles.nigerianContext, { color: theme.colors.gray400 }]}>
        {goal.nigerianContext}
      </Text>
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
            currentStep={4}
            totalSteps={7}
            style={styles.progressIndicator}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            What's your main goal?
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            Choose your primary fitness goal. You can always change this later.
          </Text>

          <ScrollView 
            style={styles.goalsList}
            showsVerticalScrollIndicator={false}
          >
            {goalOptions.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedGoal}
            style={[
              styles.continueButton,
              !selectedGoal && { opacity: 0.5 },
            ] as any}
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
  goalsList: {
    flex: 1,
  },
  goalCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 16,
    marginTop: 4,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectedIndicator: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  nigerianContext: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    marginBottom: 32,
    marginTop: 16,
  },
  continueButton: {
    marginTop: 8,
  },
});

export default FitnessGoalsScreen;