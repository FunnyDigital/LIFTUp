import React from 'react';
import { Text } from 'react-native';
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
    switch (route) {
      case 'Workouts':
        return '💪';
      case 'Diet':
        return '🥗';
      case 'Profile':
        return '👤';
      default:
        return '•';
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
          const icon = getTabBarIcon(route.name, focused);
          return (
            <Text style={{ fontSize: 28 }}>
              {icon}
            </Text>
          );
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