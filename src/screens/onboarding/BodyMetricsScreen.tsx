import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

type BodyMetricsScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'BodyMetrics'>;

const BodyMetricsScreen: React.FC = () => {
  const navigation = useNavigation<BodyMetricsScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    units: 'metric' as 'metric' | 'imperial',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else {
      const heightNum = parseFloat(formData.height);
      if (isNaN(heightNum)) {
        newErrors.height = 'Please enter a valid height';
      } else if (formData.units === 'metric') {
        if (heightNum < 120 || heightNum > 250) {
          newErrors.height = 'Height must be between 120-250 cm';
        }
      } else {
        if (heightNum < 4 || heightNum > 8) {
          newErrors.height = 'Height must be between 4-8 feet';
        }
      }
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else {
      const weightNum = parseFloat(formData.weight);
      if (isNaN(weightNum)) {
        newErrors.weight = 'Please enter a valid weight';
      } else if (formData.units === 'metric') {
        if (weightNum < 30 || weightNum > 200) {
          newErrors.weight = 'Weight must be between 30-200 kg';
        }
      } else {
        if (weightNum < 66 || weightNum > 440) {
          newErrors.weight = 'Weight must be between 66-440 lbs';
        }
      }
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
    
    // Convert to metric if needed and save to Redux
    let heightCm = parseFloat(formData.height);
    let weightKg = parseFloat(formData.weight);
    
    if (formData.units === 'imperial') {
      heightCm = heightCm * 30.48; // feet to cm
      weightKg = weightKg * 0.453592; // lbs to kg
    }
    
    dispatch(updateOnboardingData({
      height: Math.round(heightCm),
      weight: Math.round(weightKg * 10) / 10, // round to 1 decimal
    }));
    
    navigation.navigate('FitnessGoals');
  };

  const UnitToggle = () => (
    <View style={styles.unitToggle}>
      <TouchableOpacity
        style={[
          styles.unitOption,
          {
            backgroundColor: formData.units === 'metric' ? theme.colors.white : 'transparent',
            borderColor: theme.colors.white,
          }
        ]}
        onPress={() => handleInputChange('units', 'metric')}
      >
        <Text style={[
          styles.unitText,
          { color: formData.units === 'metric' ? theme.colors.black : theme.colors.white }
        ]}>
          Metric
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.unitOption,
          {
            backgroundColor: formData.units === 'imperial' ? theme.colors.white : 'transparent',
            borderColor: theme.colors.white,
          }
        ]}
        onPress={() => handleInputChange('units', 'imperial')}
      >
        <Text style={[
          styles.unitText,
          { color: formData.units === 'imperial' ? theme.colors.black : theme.colors.white }
        ]}>
          Imperial
        </Text>
      </TouchableOpacity>
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
            currentStep={3}
            totalSteps={7}
            style={styles.progressIndicator}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Your body metrics
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.gray300 }]}>
            This helps us calculate your BMI and create appropriate workout plans.
          </Text>

          <View style={styles.form}>
            <View style={styles.unitsSection}>
              <Text style={[styles.unitsLabel, { color: theme.colors.white }]}>
                Preferred Units
              </Text>
              <UnitToggle />
            </View>

            <Input
              label={`Height (${formData.units === 'metric' ? 'cm' : 'ft'})`}
              placeholder={formData.units === 'metric' ? 'e.g., 175' : 'e.g., 5.8'}
              value={formData.height}
              onChangeText={(value) => handleInputChange('height', value)}
              keyboardType="numeric"
              error={errors.height}
            />

            <Input
              label={`Weight (${formData.units === 'metric' ? 'kg' : 'lbs'})`}
              placeholder={formData.units === 'metric' ? 'e.g., 70' : 'e.g., 154'}
              value={formData.weight}
              onChangeText={(value) => handleInputChange('weight', value)}
              keyboardType="numeric"
              error={errors.weight}
            />

            <View style={styles.infoBox}>
              <Text style={[styles.infoText, { color: theme.colors.gray300 }]}>
                📝 Your data is kept private and secure. We use this information only to personalize your fitness experience.
              </Text>
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
  unitsSection: {
    marginBottom: 24,
  },
  unitsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  unitOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginBottom: 32,
  },
  continueButton: {
    marginTop: 16,
  },
});

export default BodyMetricsScreen;