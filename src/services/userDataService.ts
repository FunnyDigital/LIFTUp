import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

class UserDataService {
  // Save workout progress - store in user document instead of subcollection
  async saveWorkoutProgress(
    userId: string,
    date: string,
    completedExercises: { [key: string]: boolean }
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`workoutProgress.${date}`]: {
          completedExercises,
          updatedAt: Timestamp.now(),
        },
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error saving workout progress:', error);
      throw error;
    }
  }

  // Load workout progress - read from user document
  async loadWorkoutProgress(
    userId: string,
    date: string
  ): Promise<{ [key: string]: boolean }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const progressData = data.workoutProgress?.[date];
        return progressData?.completedExercises || {};
      }
      return {};
    } catch (error) {
      console.error('Error loading workout progress:', error);
      return {};
    }
  }

  // Get workout progress for a date range - simplified to work with user document
  async getWorkoutProgressRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Array<{ date: string; completedExercises: { [key: string]: boolean } }>> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const workoutProgress = data.workoutProgress || {};
        
        // Filter dates within range
        return Object.keys(workoutProgress)
          .filter(date => date >= startDate && date <= endDate)
          .map(date => ({
            date,
            completedExercises: workoutProgress[date]?.completedExercises || {},
          }));
      }
      return [];
    } catch (error) {
      console.error('Error getting workout progress range:', error);
      return [];
    }
  }

  // Save workout plan
  async saveWorkoutPlan(
    userId: string,
    workoutPlan: any
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        workoutPlan,
        'profile.workoutPlan': workoutPlan,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error saving workout plan:', error);
      throw error;
    }
  }

  // Save diet plan
  async saveDietPlan(
    userId: string,
    dietPlan: any
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        dietPlan,
        'profile.dietPlan': dietPlan,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error saving diet plan:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    profileUpdates: any
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        profile: profileUpdates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Load complete user data
  async loadUserData(userId: string): Promise<any> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          profile: userData.profile || {},
          workoutPlan: userData.workoutPlan || null,
          dietPlan: userData.dietPlan || null,
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      throw error;
    }
  }

  // Save meal completion - store in user document
  async saveMealCompletion(
    userId: string,
    date: string,
    mealType: string,
    completed: boolean
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`mealProgress.${date}.${mealType}`]: completed,
        [`mealProgress.${date}.updatedAt`]: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error saving meal completion:', error);
      throw error;
    }
  }

  // Load meal progress - read from user document
  async loadMealProgress(
    userId: string,
    date: string
  ): Promise<{ [key: string]: boolean }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const mealData = data.mealProgress?.[date] || {};
        delete mealData.updatedAt;
        return mealData;
      }
      return {};
    } catch (error) {
      console.error('Error loading meal progress:', error);
      return {};
    }
  }
}

export const userDataService = new UserDataService();
export default userDataService;
