import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '@/constants/theme';
import { OnboardingStackParamList } from '@/types';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

type OnboardingWelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const OnboardingWelcomeScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingWelcomeScreenNavigationProp>();
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={1}
          totalSteps={7}
          style={styles.progressIndicator}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Illustration placeholder */}
          <View style={[styles.illustration, { backgroundColor: theme.colors.gray800 }]}>
            <Text style={[styles.illustrationText, { color: theme.colors.white }]}>
              💪
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.colors.white }]}>
            Let's Get You Started!
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            We'll create a personalized fitness plan just for you. This will only take a few minutes.
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={[styles.featureIcon, { color: theme.colors.white }]}>🎯</Text>
              <Text style={[styles.featureText, { color: theme.colors.gray300 }]}>
                Tailored workout plans for Nigerian gyms
              </Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={[styles.featureIcon, { color: theme.colors.white }]}>🍽️</Text>
              <Text style={[styles.featureText, { color: theme.colors.gray300 }]}>
                Diet recommendations with local foods
              </Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={[styles.featureIcon, { color: theme.colors.white }]}>📊</Text>
              <Text style={[styles.featureText, { color: theme.colors.gray300 }]}>
                Track progress and celebrate milestones
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Let's Begin"
            onPress={() => navigation.navigate('PersonalInfo')}
            style={styles.continueButton}
          />
          
          <Text style={[styles.timeEstimate, { color: theme.colors.gray400 }]}>
            Takes about 3 minutes
          </Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressIndicator: {
    marginTop: 32,
    marginBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  illustrationText: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  features: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    marginBottom: 32,
  },
  continueButton: {
    marginBottom: 16,
  },
  timeEstimate: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default OnboardingWelcomeScreen;