import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import { AppDispatch, RootState } from '@/store';
import { signOut } from '@/store/slices/authSlice';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Get real user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  
  // Format user data for display
  const formatActivityLevel = (level: string) => {
    return level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const formatFitnessGoal = (goal: string) => {
    return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const formatEquipment = (equipment: string) => {
    return equipment.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const userData = {
    name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : (user?.email?.split('@')[0] || 'User'),
    email: user?.email || 'Not set',
    phone: user?.phoneNumber || 'Not set',
    location: userProfile?.location || 'Nigeria',
    joinDate: user?.createdAt ? formatDate(user.createdAt) : 'Recently',
    fitnessGoal: userProfile?.fitnessGoal ? formatFitnessGoal(userProfile.fitnessGoal) : 'Not set',
    activityLevel: userProfile?.activityLevel ? formatActivityLevel(userProfile.activityLevel) : 'Not set',
    height: userProfile?.height ? `${userProfile.height} cm` : 'Not set',
    weight: userProfile?.weight ? `${userProfile.weight} kg` : 'Not set',
    targetWeight: 'Not set', // TODO: Add target weight to profile
    workoutDays: userProfile?.workoutDaysPerWeek || 0,
    equipment: userProfile ? formatEquipment(userProfile.fitnessGoal.includes('home') ? 'home' : 'full_gym') : 'Not set',
  };

  const subscriptionData = {
    plan: user?.subscription?.isActive ? (user.subscription.plan?.name || 'Premium') : 'Free',
    status: user?.subscription?.isActive ? 'Active' : 'Inactive',
    nextBilling: user?.subscription?.currentPeriodEnd ? formatDate(user.subscription.currentPeriodEnd) : 'N/A',
    price: user?.subscription?.plan?.priceNGN ? `₦${user.subscription.plan.priceNGN.toLocaleString()}/month` : 'Free',
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(signOut());
          },
        },
      ]
    );
  };

  const ProfileSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.gray800 }]}>
        {children}
      </View>
    </View>
  );

  const ProfileItem = ({ 
    label, 
    value, 
    onPress, 
    showArrow = false 
  }: { 
    label: string; 
    value: string; 
    onPress?: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.profileItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemContent}>
        <Text style={[styles.profileLabel, { color: theme.colors.gray400 }]}>
          {label}
        </Text>
        <Text style={[styles.profileValue, { color: theme.colors.white }]}>
          {value}
        </Text>
      </View>
      {showArrow && (
        <Text style={[styles.arrow, { color: theme.colors.gray400 }]}>
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  const ActionButton = ({ 
    title, 
    onPress, 
    icon, 
    variant = 'default' 
  }: { 
    title: string; 
    onPress: () => void;
    icon: string;
    variant?: 'default' | 'destructive';
  }) => (
    <TouchableOpacity 
      style={[
        styles.actionButton,
        { 
          backgroundColor: variant === 'destructive' 
            ? 'rgba(255, 59, 48, 0.1)' 
            : theme.colors.gray800 
        }
      ]} 
      onPress={onPress}
    >
      <Text style={[styles.actionIcon, { color: theme.colors.white }]}>
        {icon}
      </Text>
      <Text style={[
        styles.actionTitle, 
        { 
          color: variant === 'destructive' 
            ? '#FF3B30' 
            : theme.colors.white 
        }
      ]}>
        {title}
      </Text>
      <Text style={[styles.arrow, { color: theme.colors.gray400 }]}>
        ›
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.gray800 }]}>
            <Text style={[styles.avatarText, { color: theme.colors.white }]}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.colors.white }]}>
            {userData.name}
          </Text>
          <Text style={[styles.userLocation, { color: theme.colors.gray400 }]}>
            📍 {userData.location}
          </Text>
          <Text style={[styles.joinDate, { color: theme.colors.gray500 }]}>
            Member since {userData.joinDate}
          </Text>
        </View>

        {/* Subscription */}
        <ProfileSection title="Subscription">
          <ProfileItem label="Plan" value={subscriptionData.plan} />
          <ProfileItem label="Status" value={subscriptionData.status} />
          <ProfileItem label="Price" value={subscriptionData.price} />
          <ProfileItem 
            label="Next Billing" 
            value={subscriptionData.nextBilling} 
            onPress={() => Alert.alert('Subscription', 'Manage your subscription settings')}
            showArrow
          />
        </ProfileSection>

        {/* Personal Information */}
        <ProfileSection title="Personal Information">
          <ProfileItem label="Email" value={userData.email} />
          <ProfileItem label="Phone" value={userData.phone} />
          <ProfileItem label="Height" value={userData.height} />
          <ProfileItem label="Current Weight" value={userData.weight} />
          <ProfileItem label="Target Weight" value={userData.targetWeight} />
        </ProfileSection>

        {/* Fitness Profile */}
        <ProfileSection title="Fitness Profile">
          <ProfileItem label="Fitness Goal" value={userData.fitnessGoal} />
          <ProfileItem label="Activity Level" value={userData.activityLevel} />
          <ProfileItem label="Workout Days/Week" value={`${userData.workoutDays} days`} />
          <ProfileItem label="Equipment Access" value={userData.equipment} />
        </ProfileSection>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            Settings
          </Text>
          
          <ActionButton
            title="Edit Profile"
            icon="✏️"
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
          />
          
          <ActionButton
            title="Notification Settings"
            icon="🔔"
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
          />
          
          <ActionButton
            title="Privacy & Security"
            icon="🔒"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          />
          
          <ActionButton
            title="Help & Support"
            icon="❓"
            onPress={() => Alert.alert('Support', 'Contact us at support@liftup.ng')}
          />
          
          <ActionButton
            title="About LiftUp"
            icon="ℹ️"
            onPress={() => Alert.alert('About', 'LiftUp v1.0.0\nBuilt for Nigerian fitness enthusiasts')}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <ActionButton
            title="Sign Out"
            icon="🚪"
            onPress={handleSignOut}
            variant="destructive"
          />
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.gray500 }]}>
            LiftUp - Nigerian Fitness App
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.gray500 }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.gray500 }]}>
            Made with ❤️ in Nigeria 🇳🇬
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileItemContent: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default ProfileScreen;