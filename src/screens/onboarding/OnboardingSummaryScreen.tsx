import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { usePaystack } from 'react-native-paystack-webview';

import { useTheme } from '@/constants/theme';
import { OnboardingStackParamList, UserProfile } from '@/types';
import { AppDispatch, RootState } from '@/store';
import { setOnboardingComplete } from '@/store/slices/authSlice';
import { setProfile, setWorkoutPlan, setDietPlan } from '@/store/slices/userSlice';
import { clearOnboardingData } from '@/store/slices/onboardingSlice';
import { authService } from '@/services/authService';
import { userDataService } from '@/services/userDataService';
import { workoutGenerationService } from '@/services/workoutGenerationService';
import { paymentService } from '@/services/paymentService';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

type OnboardingSummaryScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Summary'>;

const OnboardingSummaryScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingSummaryScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const { popup } = usePaystack();

  // Get collected onboarding data from Redux
  const onboardingData = useSelector((state: RootState) => state.onboarding.data);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Format data for display
  const displayData = {
    name: `${onboardingData.firstName || ''} ${onboardingData.lastName || ''}`.trim() || 'User',
    age: onboardingData.age || 0,
    sex: onboardingData.sex === 'male' ? 'Male' : 'Female',
    height: onboardingData.height ? `${onboardingData.height} cm` : 'Not set',
    weight: onboardingData.weight ? `${onboardingData.weight} kg` : 'Not set',
    goal: onboardingData.fitnessGoal ? onboardingData.fitnessGoal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set',
  // activityLevel removed
    workoutDays: onboardingData.workoutDaysPerWeek || 0,
    equipment: onboardingData.equipmentLevel ? onboardingData.equipmentLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set',
    location: onboardingData.location || 'Nigeria',
  };
  
  // Calculate estimates based on collected data
  const profile: Partial<UserProfile> = {
    firstName: onboardingData.firstName || '',
    lastName: onboardingData.lastName || '',
    age: onboardingData.age || 0,
    sex: onboardingData.sex || 'male',
    height: onboardingData.height || 0,
    weight: onboardingData.weight || 0,
  activityLevel: onboardingData.activityLevel || 'moderate',
    fitnessGoal: onboardingData.fitnessGoal || 'weight_maintenance',
    location: onboardingData.location || 'Nigeria',
    workoutDaysPerWeek: onboardingData.workoutDaysPerWeek || 3,
    preferredUnits: 'metric',
  };
  
  const estimatedTimeToGoal = profile.fitnessGoal && profile.workoutDaysPerWeek
    ? workoutGenerationService.estimateTimeToGoal(profile as UserProfile)
    : '8-12 weeks';

  const dailyCalories = profile.weight && profile.height && profile.age
    ? `${workoutGenerationService.calculateDailyCalories(profile as UserProfile).toLocaleString()} kcal`
    : '2,000 kcal';

  // Generate workout and diet plans
  const workoutPlan = workoutGenerationService.generateWorkoutsForUser(profile as UserProfile);
  // TODO: Generate diet plan using similar logic or a dietService

  const handlePaymentSuccess = async (response: any) => {
    try {
      setIsProcessing(true);
      console.log('Payment successful:', response);

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Activate subscription
      await paymentService.activateSubscription(
        user.id,
        'monthly',
        response.reference || response.transactionRef?.reference || response.data?.reference
      );

      // Complete onboarding after successful payment
      await completeOnboarding();

      Alert.alert(
        'Payment Successful! 🎉',
        'Your subscription is now active. Welcome to LiftUp!',
        [{ text: 'Get Started', onPress: () => {} }]
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert(
        'Payment Processed',
        'There was an issue activating your subscription. Please contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    Alert.alert(
      'Payment Cancelled',
      'You can complete payment anytime from your profile.',
      [{ text: 'OK' }]
    );
  };

  const completeOnboarding = async () => {
    try {
      // Save complete user profile to Redux
      const completeProfile: UserProfile = {
        firstName: onboardingData.firstName || '',
        lastName: onboardingData.lastName || '',
        age: onboardingData.age || 0,
        sex: onboardingData.sex || 'male',
        height: onboardingData.height || 0,
        weight: onboardingData.weight || 0,
        activityLevel: onboardingData.activityLevel || 'moderate',
        fitnessGoal: onboardingData.fitnessGoal || 'weight_maintenance',
        location: onboardingData.location || 'Nigeria',
        workoutDaysPerWeek: onboardingData.workoutDaysPerWeek || 3,
  selectedWorkoutDays: onboardingData.selectedWorkoutDays || onboardingData.preferences?.selectedWorkoutDays || [],
        preferredUnits: 'metric',
      };
      
      // Save to Redux
      dispatch(setProfile(completeProfile));
      
      // Generate plans
      const generatedWorkoutPlan = workoutGenerationService.generateWorkoutsForUser(completeProfile);
      dispatch(setWorkoutPlan(generatedWorkoutPlan));
      
      // Save to Firestore if user is logged in
      if (user?.id) {
        await authService.updateUserProfile(user.id, completeProfile);
        
        // Save workout and diet plans
        await userDataService.saveWorkoutPlan(user.id, generatedWorkoutPlan);
        
        // Save plan duration, calorie goal, and selectedWorkoutDays as top-level fields
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('@/services/firebase');
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          planDuration: estimatedTimeToGoal,
          calorieGoal: workoutGenerationService.calculateDailyCalories(completeProfile),
          selectedWorkoutDays: completeProfile.selectedWorkoutDays,
          equipmentLevel: onboardingData.equipmentLevel,
        });
      }
      
      // Clear onboarding data
      dispatch(clearOnboardingData());
      
      // Mark onboarding as complete
      dispatch(setOnboardingComplete());
      
      // Navigation will be handled by the auth state change
    } catch (error) {
      console.error('Error saving profile:', error);
      // Still mark onboarding as complete even if Firestore save fails
      dispatch(setOnboardingComplete());
    }
  };

  const handleProceedToPayment = () => {
    if (!user?.email) {
      Alert.alert('Error', 'User email not found. Please try again.');
      return;
    }
    
    // Trigger Paystack payment using the hook
    popup.checkout({
      email: user.email,
      amount: paymentService.getSubscriptionAmount('monthly'),
      reference: `LIFT_${Date.now()}_${user.id}`,
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'bank_transfer'],
      metadata: {
        custom_fields: [
          {
            display_name: 'User ID',
            variable_name: 'user_id',
            value: user.id || ''
          },
          {
            display_name: 'Plan',
            variable_name: 'plan',
            value: 'monthly'
          }
        ]
      },
      onSuccess: handlePaymentSuccess,
      onCancel: handlePaymentCancel,
      onError: (error) => {
        console.error('Payment error:', error);
        Alert.alert('Payment Error', 'There was an error processing your payment. Please try again.');
      }
    });
  };

  const SummaryItem = ({ 
    label, 
    value, 
    icon 
  }: { 
    label: string; 
    value: string; 
    icon: string; 
  }) => (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryIcon, { color: theme.colors.white }]}>
        {icon}
      </Text>
      <View style={styles.summaryContent}>
        <Text style={[styles.summaryLabel, { color: theme.colors.gray300 }]}>
          {label}
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.white }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  const GoalEstimate = () => (
    <View style={[styles.goalEstimateCard, { backgroundColor: theme.colors.gray800 }]}>
      <Text style={[styles.goalEstimateTitle, { color: theme.colors.white }]}>
        🎯 Your Personalized Plan
      </Text>
      
      <View style={styles.estimateRow}>
        <View style={styles.estimateItem}>
          <Text style={[styles.estimateValue, { color: theme.colors.white }]}>
            {estimatedTimeToGoal}
          </Text>
          <Text style={[styles.estimateLabel, { color: theme.colors.gray300 }]}>
            Estimated time to goal
          </Text>
        </View>
        
        <View style={styles.estimateItem}>
          <Text style={[styles.estimateValue, { color: theme.colors.white }]}>
            {dailyCalories}
          </Text>
          <Text style={[styles.estimateLabel, { color: theme.colors.gray300 }]}>
            Daily calories target
          </Text>
        </View>
      </View>
      
      <Text style={[styles.goalDisclaimer, { color: theme.colors.gray400 }]}>
        * Estimates based on your inputs and Nigerian lifestyle factors
      </Text>
    </View>
  );

  return (
    <Screen scrollable>
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
            currentStep={7}
            totalSteps={7}
            style={styles.progressIndicator}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            You're all set, {displayData.name.split(' ')[0]}! 🎉
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            Here's your personalized fitness profile. You can always update this later.
          </Text>

          <ScrollView style={styles.summaryList} showsVerticalScrollIndicator={false}>
            <SummaryItem
              icon="👤"
              label="Personal Info"
              value={`${displayData.age} years, ${displayData.sex}`}
            />
            
            <SummaryItem
              icon="📏"
              label="Body Metrics"
              value={`${displayData.height}, ${displayData.weight}`}
            />
            
            <SummaryItem
              icon="🎯"
              label="Fitness Goal"
              value={displayData.goal}
            />
            

            
            <SummaryItem
              icon="📅"
              label="Workout Schedule"
              value={`${displayData.workoutDays} days per week`}
            />
            
            <SummaryItem
              icon="🏋️"
              label="Equipment Access"
              value={displayData.equipment}
            />
            
            <SummaryItem
              icon="📍"
              label="Location"
              value={displayData.location}
            />

            <View style={[styles.goalEstimateCard, { backgroundColor: theme.colors.gray800 }]}>
              <Text style={[styles.goalEstimateTitle, { color: theme.colors.white }]}>🎯 Your Personalized Plan</Text>
              <View style={styles.estimateRow}>
                <View style={styles.estimateItem}>
                  <Text style={[styles.estimateValue, { color: theme.colors.white }]}>{estimatedTimeToGoal}</Text>
                  <Text style={[styles.estimateLabel, { color: theme.colors.gray300 }]}>Estimated time to goal</Text>
                </View>
                <View style={styles.estimateItem}>
                  <Text style={[styles.estimateValue, { color: theme.colors.white }]}>{dailyCalories}</Text>
                  <Text style={[styles.estimateLabel, { color: theme.colors.gray300 }]}>Daily calories target</Text>
                </View>
              </View>
              <Text style={[styles.goalDisclaimer, { color: theme.colors.gray400 }]}>* Estimates based on your inputs and Nigerian lifestyle factors</Text>
            </View>

            {/* Subscription Card */}
            <View style={[styles.subscriptionCard, { backgroundColor: theme.colors.gray800, borderColor: theme.colors.white }]}>
              <Text style={[styles.subscriptionTitle, { color: theme.colors.white }]}>
                💳 Monthly Subscription
              </Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.currencySymbol, { color: theme.colors.gray300 }]}>₦</Text>
                <Text style={[styles.priceAmount, { color: theme.colors.white }]}>1,000</Text>
                <Text style={[styles.pricePeriod, { color: theme.colors.gray300 }]}>/month</Text>
              </View>
              <Text style={[styles.subscriptionDescription, { color: theme.colors.gray300 }]}>
                Unlock your personalized workout and diet plans
              </Text>
              <View style={styles.featuresList}>
                <Text style={[styles.featureItem, { color: theme.colors.gray200 }]}>✓ Personalized workout plans</Text>
                <Text style={[styles.featureItem, { color: theme.colors.gray200 }]}>✓ Nigerian-tailored diet plans</Text>
                <Text style={[styles.featureItem, { color: theme.colors.gray200 }]}>✓ Progress tracking</Text>
                <Text style={[styles.featureItem, { color: theme.colors.gray200 }]}>✓ Expert fitness guidance</Text>
              </View>
            </View>

            <View style={styles.nextStepsCard}>
              <Text style={[styles.nextStepsTitle, { color: theme.colors.white }]}>
                What's Next?
              </Text>
              
              <View style={styles.nextStep}>
                <Text style={[styles.stepNumber, { color: theme.colors.white }]}>1</Text>
                <Text style={[styles.stepText, { color: theme.colors.gray300 }]}>
                  Choose a subscription plan to unlock your workout plans
                </Text>
              </View>
              
              <View style={styles.nextStep}>
                <Text style={[styles.stepNumber, { color: theme.colors.white }]}>2</Text>
                <Text style={[styles.stepText, { color: theme.colors.gray300 }]}>
                  Get your personalized workout and diet recommendations
                </Text>
              </View>
              
              <View style={styles.nextStep}>
                <Text style={[styles.stepNumber, { color: theme.colors.white }]}>3</Text>
                <Text style={[styles.stepText, { color: theme.colors.gray300 }]}>
                  Start tracking your progress and achieve your goals
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={isProcessing ? "Processing..." : "Proceed to Payment"}
            onPress={handleProceedToPayment}
            style={styles.completeButton}
            disabled={isProcessing}
          />
          
          <Text style={[styles.welcomeText, { color: theme.colors.gray400 }]}>
            Secure payment via Paystack 🔒
          </Text>
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
  summaryList: {
    flex: 1,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalEstimateCard: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 24,
  },
  goalEstimateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  estimateItem: {
    alignItems: 'center',
  },
  estimateValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  estimateLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  goalDisclaimer: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  nextStepsCard: {
    marginTop: 16,
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginBottom: 32,
    marginTop: 16,
  },
  completeButton: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  subscriptionCard: {
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 32,
    borderWidth: 2,
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
  pricePeriod: {
    fontSize: 16,
    marginTop: 8,
    marginLeft: 4,
  },
  subscriptionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    width: '100%',
    paddingHorizontal: 16,
  },
  featureItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default OnboardingSummaryScreen;