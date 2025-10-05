import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/types';
import { useTheme } from '@/constants/theme';

// Import main screens
import HomeScreen from '@/screens/main/HomeScreen';
import WorkoutsScreen from '@/screens/main/WorkoutsScreen';
import CalendarScreen from '@/screens/main/CalendarScreen';
import ProgressScreen from '@/screens/main/ProgressScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const theme = useTheme();

  const getTabBarIcon = (route: string, focused: boolean) => {    
    switch (route) {
      case 'Home':
        return `🏠`;
      case 'Workouts':
        return `💪`;
      case 'Calendar':
        return `📅`;
      case 'Progress':
        return `📊`;
      case 'Profile':
        return `👤`;
      default:
        return `•`;
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
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.gray400,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
          marginTop: 4,
        },
        tabBarIcon: ({ focused }) => {
          const icon = getTabBarIcon(route.name, focused);
          return (
            <React.Fragment>
              {icon}
            </React.Fragment>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsScreen}
        options={{
          tabBarLabel: 'Workouts',
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
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