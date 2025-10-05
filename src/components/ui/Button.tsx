import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 16, paddingHorizontal: 24 },
      large: { paddingVertical: 20, paddingHorizontal: 32 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.colors.gray600 : theme.colors.white,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.gray800 : theme.colors.gray700,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.gray600 : theme.colors.white,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      small: { fontSize: theme.typography.fontSize.sm },
      medium: { fontSize: theme.typography.fontSize.base },
      large: { fontSize: theme.typography.fontSize.lg },
    };

    const variantStyles = {
      primary: {
        color: disabled ? theme.colors.gray400 : theme.colors.black,
        fontWeight: theme.typography.fontWeight.semibold,
      },
      secondary: {
        color: disabled ? theme.colors.gray400 : theme.colors.white,
        fontWeight: theme.typography.fontWeight.medium,
      },
      outline: {
        color: disabled ? theme.colors.gray400 : theme.colors.white,
        fontWeight: theme.typography.fontWeight.medium,
      },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.black : theme.colors.white}
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;