import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { useTheme } from '@/constants/theme';
import { AuthStackParamList } from '@/types';
import { AppDispatch } from '@/store';
import { signInWithPhone } from '@/store/slices/authSlice';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type VerifyOTPScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'VerifyOTP'>;
type VerifyOTPScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyOTP'>;

const VerifyOTPScreen: React.FC = () => {
  const navigation = useNavigation<VerifyOTPScreenNavigationProp>();
  const route = useRoute<VerifyOTPScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState(route.params?.phoneNumber || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>(route.params?.phoneNumber ? 'otp' : 'phone');
  const [error, setError] = useState('');

  const otpRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, step]);

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return false;
    }
    // Nigerian phone number validation
    const nigerianPhoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
    if (!nigerianPhoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid Nigerian phone number');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendOTP = async () => {
    if (!validatePhoneNumber()) return;

    setIsLoading(true);
    try {
      // Simulate sending OTP - replace with actual Firebase auth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      
      Alert.alert(
        'OTP Sent!',
        `Verification code sent to ${phoneNumber}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Failed to send OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(signInWithPhone({
        phoneNumber,
        otp: otpCode,
      })).unwrap();
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        'Invalid verification code. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendTimer(30);
      setCanResend(false);
      
      Alert.alert(
        'OTP Resent!',
        'New verification code sent to your phone.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Failed to resend OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  if (step === 'phone') {
    return (
      <Screen scrollable keyboardAvoiding>
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
            
            <Text style={[styles.title, { color: theme.colors.white }]}>
              Phone Verification
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
              Enter your Nigerian phone number to receive a verification code.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Phone Number"
              placeholder="e.g., +234 803 123 4567"
              value={phoneNumber}
              onChangeText={(value) => {
                setPhoneNumber(value);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              leftIcon="phone"
              error={error}
            />
          </View>

          <View style={styles.actions}>
            <Button
              title={isLoading ? 'Sending...' : 'Send Verification Code'}
              onPress={handleSendOTP}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep('phone')}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.white }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Enter Verification Code
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            We sent a 6-digit code to {phoneNumber}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) otpRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  {
                    borderColor: digit ? theme.colors.white : theme.colors.gray600,
                    backgroundColor: theme.colors.gray800,
                    color: theme.colors.white,
                  }
                ]}
                value={digit}
                onChangeText={(value) => handleOTPChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleOTPKeyPress(index, nativeEvent.key)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
                <Text style={[styles.resendText, { color: theme.colors.white }]}>
                  {resendLoading ? 'Resending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.timerText, { color: theme.colors.gray400 }]}>
                Resend code in {resendTimer}s
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title={isLoading ? 'Verifying...' : 'Verify & Continue'}
            onPress={handleVerifyOTP}
            loading={isLoading}
            disabled={isLoading || otp.join('').length !== 6}
          />
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  timerText: {
    fontSize: 14,
  },
  actions: {
    marginBottom: 32,
  },
});

export default VerifyOTPScreen;