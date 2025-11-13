import { Middleware, isAction } from '@reduxjs/toolkit';
import { userDataService } from '@/services/userDataService';
import { RootState } from '@/store';

// Middleware to sync Redux state changes to Firebase
export const syncMiddleware: Middleware = (storeAPI) => (next) => async (action) => {
  const result = next(action);
  
  // Check if action is a valid action
  if (!isAction(action)) {
    return result;
  }
  
  // Get current state after action
  const state = storeAPI.getState() as RootState;
  const userId = state.auth.user?.id;
  
  if (!userId) {
    return result;
  }
  
  // Sync profile changes
  if (action.type === 'user/setProfile' || action.type === 'user/updateProfile') {
    try {
      const profile = state.user.profile;
      if (profile) {
        await userDataService.updateUserProfile(userId, profile);
      }
    } catch (error) {
      console.error('Error syncing profile to Firebase:', error);
    }
  }
  
  // Sync workout plan changes
  if (action.type === 'user/setWorkoutPlan') {
    try {
      const workoutPlan = state.user.workoutPlan;
      if (workoutPlan) {
        await userDataService.saveWorkoutPlan(userId, workoutPlan);
      }
    } catch (error) {
      console.error('Error syncing workout plan to Firebase:', error);
    }
  }
  
  // Sync diet plan changes
  if (action.type === 'user/setDietPlan') {
    try {
      const dietPlan = state.user.dietPlan;
      if (dietPlan) {
        await userDataService.saveDietPlan(userId, dietPlan);
      }
    } catch (error) {
      console.error('Error syncing diet plan to Firebase:', error);
    }
  }
  
  return result;
};
