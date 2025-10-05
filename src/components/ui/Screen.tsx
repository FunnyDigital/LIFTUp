import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  padding?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  keyboardAvoiding = true,
  padding = true,
  backgroundColor,
  style,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || theme.colors.black,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    padding: padding ? theme.spacing.lg : 0,
  };

  const content = (
    <View style={[contentStyle, style]}>
      {children}
    </View>
  );

  const wrappedContent = scrollable ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const screenContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {wrappedContent}
    </KeyboardAvoidingView>
  ) : (
    wrappedContent
  );

  return (
    <SafeAreaView style={containerStyle}>
      {screenContent}
    </SafeAreaView>
  );
};

export default Screen;