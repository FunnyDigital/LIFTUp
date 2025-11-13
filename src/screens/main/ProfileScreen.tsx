import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/constants/theme';
import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import { AppDispatch, RootState } from '@/store';
import { signOut } from '@/store/slices/authSlice';
import { updateProfile, setWorkoutPlan, setDietPlan } from '@/store/slices/userSlice';
import { authService } from '@/services/authService';
import { userDataService } from '@/services/userDataService';
import { workoutGenerationService } from '@/services/workoutGenerationService';
import { paymentService } from '@/services/paymentService';
import type { UserProfile, FitnessGoal } from '@/types';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    height: '',
    weight: '',
    workoutDaysPerWeek: '',
    selectedWorkoutDays: [] as string[],
  });

  // Get real user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  
  useEffect(() => {
    loadSubscriptionStatus();
  }, [user?.id]);

  useEffect(() => {
    if (userProfile && showEditModal) {
      setEditForm({
        height: userProfile.height?.toString() || '',
        weight: userProfile.weight?.toString() || '',
        workoutDaysPerWeek: userProfile.workoutDaysPerWeek?.toString() || '',
        selectedWorkoutDays: userProfile.selectedWorkoutDays || [],
      });
    }
  }, [userProfile, showEditModal]);

  const loadSubscriptionStatus = async () => {
    if (!user?.id) return;
    
    try {
      const { getDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/services/firebase');
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const subscription = data.subscription;
        
        // Convert Firestore Timestamps to plain objects for display
        if (subscription) {
          const convertedSubscription = {
            plan: subscription.plan || 'free',
            status: subscription.status || 'inactive',
            amount: subscription.amount || 0,
            paystackReference: subscription.paystackReference || '',
            startDate: subscription.startDate?.toDate ? subscription.startDate.toDate() : null,
            endDate: subscription.endDate?.toDate ? subscription.endDate.toDate() : null,
            updatedAt: subscription.updatedAt?.toDate ? subscription.updatedAt.toDate() : null,
          };
          setSubscriptionStatus(convertedSubscription);
        }
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };
  
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
    plan: subscriptionStatus?.plan === 'monthly' ? 'Monthly' : subscriptionStatus?.plan === 'quarterly' ? 'Quarterly' : subscriptionStatus?.plan === 'yearly' ? 'Yearly' : 'Free',
    status: subscriptionStatus?.status === 'active' ? 'Active ✓' : 'Inactive',
    amount: subscriptionStatus?.amount ? `₦${subscriptionStatus.amount.toLocaleString()}` : 'Free',
    nextBilling: subscriptionStatus?.endDate ? formatDate(subscriptionStatus.endDate.toISOString()) : 'N/A',
    reference: subscriptionStatus?.paystackReference || 'N/A',
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      const updates: Partial<UserProfile> = {
        ...userProfile!,
        height: parseInt(editForm.height) || userProfile!.height,
        weight: parseInt(editForm.weight) || userProfile!.weight,
        workoutDaysPerWeek: parseInt(editForm.workoutDaysPerWeek) || userProfile!.workoutDaysPerWeek,
        selectedWorkoutDays: editForm.selectedWorkoutDays.length > 0 ? editForm.selectedWorkoutDays : userProfile!.selectedWorkoutDays,
      };

      // Update Redux
      dispatch(updateProfile(updates));

      // Update Firebase
      if (user?.id) {
        await authService.updateUserProfile(user.id, updates);
      }

      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWorkoutPlan = async (newGoal: FitnessGoal) => {
    try {
      setIsLoading(true);

      const updates: Partial<UserProfile> = {
        ...userProfile!,
        fitnessGoal: newGoal,
      };

      // Update Redux
      dispatch(updateProfile(updates));

      // Regenerate workout and diet plans
      const newWorkoutPlan = workoutGenerationService.generateWorkoutsForUser(updates as UserProfile);
      dispatch(setWorkoutPlan(newWorkoutPlan));

      // Update Firebase
      if (user?.id) {
        await authService.updateUserProfile(user.id, updates);
        await userDataService.saveWorkoutPlan(user.id, newWorkoutPlan);
      }

      setShowWorkoutModal(false);
      Alert.alert('Success', 'Your workout plan has been updated based on your new fitness goal!');
    } catch (error) {
      console.error('Error updating workout plan:', error);
      Alert.alert('Error', 'Failed to update workout plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkoutDay = (day: string) => {
    setEditForm(prev => ({
      ...prev,
      selectedWorkoutDays: prev.selectedWorkoutDays.includes(day)
        ? prev.selectedWorkoutDays.filter(d => d !== day)
        : [...prev.selectedWorkoutDays, day]
    }));
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
        <ProfileSection title="💳 Subscription">
          <ProfileItem label="Plan" value={subscriptionData.plan} />
          <ProfileItem label="Status" value={subscriptionData.status} />
          <ProfileItem label="Amount" value={subscriptionData.amount} />
          <ProfileItem label="Next Billing" value={subscriptionData.nextBilling} />
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
        <ProfileSection title="🏋️ Fitness Profile">
          <ProfileItem label="Fitness Goal" value={userData.fitnessGoal} />
          <ProfileItem label="Activity Level" value={userData.activityLevel} />
          <ProfileItem label="Workout Days/Week" value={`${userData.workoutDays} days`} />
          <ProfileItem 
            label="Selected Days" 
            value={userProfile?.selectedWorkoutDays?.join(', ') || 'Not set'} 
          />
        </ProfileSection>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>
            Settings
          </Text>
          
          <ActionButton
            title="Edit Profile"
            icon="✏️"
            onPress={() => setShowEditModal(true)}
          />
          
          <ActionButton
            title="Change Fitness Goal & Plan"
            icon="🎯"
            onPress={() => setShowWorkoutModal(true)}
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

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.gray900 }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.white }]}>
              Edit Profile
            </Text>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.gray300 }]}>
                Height (cm)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.gray800, color: theme.colors.white }]}
                value={editForm.height}
                onChangeText={(text) => setEditForm({ ...editForm, height: text })}
                keyboardType="numeric"
                placeholder={userProfile?.height?.toString() || "170"}
                placeholderTextColor={theme.colors.gray500}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.gray300 }]}>
                Weight (kg)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.gray800, color: theme.colors.white }]}
                value={editForm.weight}
                onChangeText={(text) => setEditForm({ ...editForm, weight: text })}
                keyboardType="numeric"
                placeholder={userProfile?.weight?.toString() || "70"}
                placeholderTextColor={theme.colors.gray500}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.gray300 }]}>
                Workout Days Per Week
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.gray800, color: theme.colors.white }]}
                value={editForm.workoutDaysPerWeek}
                onChangeText={(text) => setEditForm({ ...editForm, workoutDaysPerWeek: text })}
                keyboardType="numeric"
                placeholder="3"
                placeholderTextColor={theme.colors.gray500}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.gray300 }]}>
                Select Workout Days
              </Text>
              <View style={styles.daysGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayChip,
                      { 
                        backgroundColor: editForm.selectedWorkoutDays.includes(day) 
                          ? theme.colors.white 
                          : theme.colors.gray800,
                        borderColor: theme.colors.gray600
                      }
                    ]}
                    onPress={() => toggleWorkoutDay(day)}
                  >
                    <Text style={[
                      styles.dayChipText,
                      { 
                        color: editForm.selectedWorkoutDays.includes(day) 
                          ? theme.colors.black 
                          : theme.colors.white 
                      }
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.gray700 }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.white }]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.black }]}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Fitness Goal Modal */}
      <Modal
        visible={showWorkoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWorkoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.gray900 }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.white }]}>
              Change Fitness Goal
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.gray400 }]}>
              This will regenerate your workout and diet plans
            </Text>

            <View style={styles.goalsContainer}>
              {[
                { id: 'lose_belly_fat', label: 'Lose Belly Fat', icon: '🔥' },
                { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
                { id: 'build_lean_mass', label: 'Build Lean Mass', icon: '🏃' },
                { id: 'strength_training', label: 'Strength Training', icon: '🏋️' },
                { id: 'improve_cardio', label: 'Improve Cardio', icon: '❤️' },
                { id: 'weight_maintenance', label: 'Weight Maintenance', icon: '⚖️' },
              ].map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalOption,
                    { 
                      backgroundColor: theme.colors.gray800,
                      borderColor: userProfile?.fitnessGoal === goal.id 
                        ? theme.colors.white 
                        : theme.colors.gray700
                    }
                  ]}
                  onPress={() => handleUpdateWorkoutPlan(goal.id as FitnessGoal)}
                  disabled={isLoading}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[styles.goalLabel, { color: theme.colors.white }]}>
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.gray700, width: '100%' }]}
              onPress={() => setShowWorkoutModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  goalsContainer: {
    marginBottom: 24,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;