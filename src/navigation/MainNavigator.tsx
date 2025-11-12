import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/types';
import { useTheme } from '@/constants/theme';

// Import main screens
import WorkoutsScreen from '@/screens/main/WorkoutsScreen';
import DietScreen from '@/screens/main/DietScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const theme = useTheme();

  const getTabBarIcon = (route: string, focused: boolean) => {
    const iconColor = focused ? theme.colors.white : theme.colors.gray400;
    const iconSize = 24;
    
    switch (route) {
      case 'Workouts':
        // Dumbbell icon
        return (
          <View style={{ width: iconSize, height: iconSize, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ 
              width: 18, 
              height: 4, 
              backgroundColor: iconColor,
              borderRadius: 2,
            }} />
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              width: iconSize,
              position: 'absolute',
            }}>
              <View style={{ 
                width: 5, 
                height: iconSize, 
                backgroundColor: iconColor,
                borderRadius: 2,
              }} />
              <View style={{ 
                width: 5, 
                height: iconSize, 
                backgroundColor: iconColor,
                borderRadius: 2,
              }} />
            </View>
          </View>
        );
      case 'Diet':
        // Fork and knife icon
        return (
          <View style={{ width: iconSize, height: iconSize, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 2, height: 10, backgroundColor: iconColor }} />
              <View style={{ width: 8, height: 2, backgroundColor: iconColor, marginTop: -2 }} />
              <View style={{ width: 2, height: 8, backgroundColor: iconColor }} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 2, height: 18, backgroundColor: iconColor }} />
              <View style={{ 
                width: 8, 
                height: 8, 
                borderColor: iconColor,
                borderWidth: 2,
                borderRadius: 4,
                position: 'absolute',
                top: 0,
              }} />
            </View>
          </View>
        );
      case 'Profile':
        // User icon
        return (
          <View style={{ width: iconSize, height: iconSize, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ 
              width: 8, 
              height: 8, 
              borderRadius: 4,
              backgroundColor: iconColor,
              marginBottom: 2,
            }} />
            <View style={{ 
              width: 16, 
              height: 10, 
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              backgroundColor: iconColor,
            }} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.black,
          borderTopColor: theme.colors.gray800,
          borderTopWidth: 1,
          paddingTop: 12,
          paddingBottom: 12,
          height: 75,
        },
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.gray400,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600' as const,
          marginTop: 6,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ focused }) => {
          return getTabBarIcon(route.name, focused);
        },
      })}
    >
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsScreen}
        options={{
          tabBarLabel: 'Workouts',
        }}
      />
      <Tab.Screen 
        name="Diet" 
        component={DietScreen}
        options={{
          tabBarLabel: 'Diet Plan',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;