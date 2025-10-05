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
import { useDispatch } from 'react-redux';

import { useTheme } from '@/constants/theme';
import { OnboardingStackParamList } from '@/types';
import { AppDispatch } from '@/store';
import { updateOnboardingData } from '@/store/slices/onboardingSlice';

import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

type PersonalInfoScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'PersonalInfo'>;

const PersonalInfoScreen: React.FC = () => {
  const navigation = useNavigation<PersonalInfoScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    sex: '' as 'male' | 'female' | '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 80) {
        newErrors.age = 'Please enter a valid age (16-80)';
      }
    }

    if (!formData.sex) {
      newErrors.sex = 'Please select your sex';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Save personal info to Redux store
    dispatch(updateOnboardingData({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      age: parseInt(formData.age),
      sex: formData.sex as 'male' | 'female',
    }));
    
    navigation.navigate('BodyMetrics');
  };

  const SexOption = ({ 
    value, 
    label, 
    icon 
  }: { 
    value: 'male' | 'female'; 
    label: string; 
    icon: string; 
  }) => (
    <TouchableOpacity
      style={[
        styles.sexOption,
        {
          borderColor: formData.sex === value ? theme.colors.white : theme.colors.gray600,
          backgroundColor: formData.sex === value ? theme.colors.gray800 : 'transparent',
        }
      ]}
      onPress={() => {
        handleInputChange('sex', value);
      }}
    >
      <Text style={[styles.sexIcon, { color: theme.colors.white }]}>{icon}</Text>
      <Text style={[
        styles.sexLabel,
        { 
          color: formData.sex === value ? theme.colors.white : theme.colors.gray300,
          fontWeight: formData.sex === value ? '600' : '400',
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
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
            currentStep={2}
            totalSteps={7}
            style={styles.progressIndicator}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Tell us about yourself
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            This helps us create a personalized fitness plan for you.
          </Text>

          <View style={styles.form}>
            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              autoCapitalize="words"
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              autoCapitalize="words"
              error={errors.lastName}
            />

            <Input
              label="Age"
              placeholder="Enter your age"
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              keyboardType="numeric"
              error={errors.age}
            />

            <View style={styles.sexContainer}>
              <Text style={[styles.sexLabel, { color: theme.colors.white }]}>
                Sex
              </Text>
              <View style={styles.sexOptions}>
                <SexOption value="male" label="Male" icon="♂️" />
                <SexOption value="female" label="Female" icon="♀️" />
              </View>
              {errors.sex && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.sex}
                </Text>
              )}
            </View>
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
    justifyContent: 'space-between',
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
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  sexContainer: {
    marginBottom: 24,
  },
  sexLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  sexOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  sexOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    marginBottom: 32,
  },
  continueButton: {
    marginTop: 16,
  },
});

export default PersonalInfoScreen;