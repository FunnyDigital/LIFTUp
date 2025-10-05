import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@/constants/theme';
import { AuthStackParamList } from '@/types';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.black }]}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={[styles.logoContainer, { backgroundColor: theme.colors.gray800 }]}>
          <Text style={[styles.logo, { color: theme.colors.white }]}>
            LiftUp
          </Text>
        </View>

        {/* Tagline */}
        <Text style={[styles.tagline, { color: theme.colors.white }]}>
          Your Nigerian Fitness Journey Starts Here
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
          Personalized workouts and diet plans for Nigerian gym-goers
        </Text>

        {/* CTA Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.white }]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={[styles.primaryButtonText, { color: theme.colors.black }]}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.colors.gray600 }]}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.white }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={[styles.featureText, { color: theme.colors.gray300 }]}>
              ✓ Nigerian-friendly workout plans
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={[styles.featureText, { color: theme.colors.gray300 }]}>
              ✓ Local diet recommendations
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={[styles.featureText, { color: theme.colors.gray300 }]}>
              ✓ Progress tracking & analytics
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 48,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  featuresContainer: {
    width: '100%',
  },
  feature: {
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WelcomeScreen;