import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '@/constants/theme';
import { AuthStackParamList } from '@/types';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      Alert.alert(
        'Reset Link Sent!',
        'Please check your email for password reset instructions.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Failed to send reset email. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  if (emailSent) {
    return (
      <Screen>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backButtonText, { color: theme.colors.white }]}>
                ← Back
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: theme.colors.gray800 }]}>
              <Text style={[styles.successIconText, { color: theme.colors.white }]}>✓</Text>
            </View>
            
            <Text style={[styles.successTitle, { color: theme.colors.white }]}>
              Check Your Email
            </Text>
            
            <Text style={[styles.successSubtitle, { color: theme.colors.gray300 }]}>
              We've sent password reset instructions to:
            </Text>
            
            <Text style={[styles.emailText, { color: theme.colors.white }]}>
              {email}
            </Text>
            
            <Text style={[styles.instructionText, { color: theme.colors.gray300 }]}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Resend Email"
              onPress={handleResetPassword}
              variant="outline"
              style={styles.resendButton}
            />
            
            <Button
              title="Back to Sign In"
              onPress={() => navigation.navigate('SignIn')}
              style={styles.backToSignInButton}
            />
          </View>
        </View>
      </Screen>
    );
  }

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
          
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={handleInputChange}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
            error={error}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={isLoading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            style={styles.resetButton}
          />
          
          <TouchableOpacity
            style={styles.backToSignInLink}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={[styles.backToSignInText, { color: theme.colors.gray300 }]}>
              Remember your password? Sign In
            </Text>
          </TouchableOpacity>
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
  header: {
    marginTop: 32,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  actions: {
    marginBottom: 32,
  },
  resetButton: {
    marginBottom: 24,
  },
  backToSignInLink: {
    alignSelf: 'center',
  },
  backToSignInText: {
    fontSize: 14,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successIconText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resendButton: {
    marginBottom: 16,
  },
  backToSignInButton: {
    marginBottom: 16,
  },
});

export default ForgotPasswordScreen;