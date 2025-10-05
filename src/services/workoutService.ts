import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  WorkoutPlan, 
  Workout, 
  Exercise, 
  FitnessGoal, 
  ScheduledWorkout,
  WorkoutSession 
} from '@/types';

// Collections
const WORKOUT_PLANS_COLLECTION = 'workout_plans';
const WORKOUTS_COLLECTION = 'workouts';
const EXERCISES_COLLECTION = 'exercises';
const SCHEDULED_WORKOUTS_COLLECTION = 'scheduled_workouts';
const WORKOUT_SESSIONS_COLLECTION = 'workout_sessions';

class WorkoutService {
  // Workout Plans
  async getWorkoutPlans(filters?: {
    goal?: FitnessGoal;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    equipmentLevel?: 'home' | 'basic_gym' | 'full_gym';
  }): Promise<WorkoutPlan[]> {
    try {
      let q = query(collection(db, WORKOUT_PLANS_COLLECTION));
      
      if (filters?.goal) {
        q = query(q, where('goal', '==', filters.goal));
      }
      if (filters?.difficulty) {
        q = query(q, where('difficulty', '==', filters.difficulty));
      }
      if (filters?.equipmentLevel) {
        q = query(q, where('equipmentLevel', '==', filters.equipmentLevel));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as WorkoutPlan[];
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      throw error;
    }
  }

  async getWorkoutPlan(planId: string): Promise<WorkoutPlan | null> {
    try {
      const docRef = doc(db, WORKOUT_PLANS_COLLECTION, planId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as WorkoutPlan;
      }
      return null;
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      throw error;
    }
  }

  // Individual Workouts
  async getWorkouts(filters?: {
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    equipment?: string[];
    muscleGroups?: string[];
  }): Promise<Workout[]> {
    try {
      let q = query(collection(db, WORKOUTS_COLLECTION));
      
      if (filters?.difficulty) {
        q = query(q, where('difficulty', '==', filters.difficulty));
      }
      
      q = query(q, orderBy('name'));
      
      const querySnapshot = await getDocs(q);
      let workouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];
      
      // Client-side filtering for array fields
      if (filters?.equipment) {
        workouts = workouts.filter(workout => 
          filters.equipment!.some(eq => workout.equipment.includes(eq))
        );
      }
      
      if (filters?.muscleGroups) {
        workouts = workouts.filter(workout => 
          filters.muscleGroups!.some(mg => workout.muscleGroups.includes(mg))
        );
      }
      
      return workouts;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }

  async getWorkout(workoutId: string): Promise<Workout | null> {
    try {
      const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Workout;
      }
      return null;
    } catch (error) {
      console.error('Error fetching workout:', error);
      throw error;
    }
  }

  // Exercises
  async getExercises(filters?: {
    muscleGroups?: string[];
    equipment?: string[];
  }): Promise<Exercise[]> {
    try {
      let q = query(collection(db, EXERCISES_COLLECTION));
      q = query(q, orderBy('name'));
      
      const querySnapshot = await getDocs(q);
      let exercises = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Exercise[];
      
      // Client-side filtering
      if (filters?.muscleGroups) {
        exercises = exercises.filter(exercise => 
          filters.muscleGroups!.some(mg => exercise.muscleGroups.includes(mg))
        );
      }
      
      if (filters?.equipment) {
        exercises = exercises.filter(exercise => 
          !exercise.equipment || 
          filters.equipment!.some(eq => exercise.equipment!.includes(eq))
        );
      }
      
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  async getExercise(exerciseId: string): Promise<Exercise | null> {
    try {
      const docRef = doc(db, EXERCISES_COLLECTION, exerciseId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Exercise;
      }
      return null;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  }

  // Scheduled Workouts
  async scheduleWorkout(userId: string, workoutData: {
    workoutId: string;
    planId?: string;
    scheduledDate: Date;
    notes?: string;
  }): Promise<string> {
    try {
      const scheduledWorkout: Omit<ScheduledWorkout, 'id'> = {
        userId,
        workoutId: workoutData.workoutId,
        planId: workoutData.planId || '',
        scheduledDate: workoutData.scheduledDate,
        status: 'scheduled',
        notes: workoutData.notes,
      };
      
      const docRef = await addDoc(
        collection(db, SCHEDULED_WORKOUTS_COLLECTION),
        {
          ...scheduledWorkout,
          scheduledDate: Timestamp.fromDate(workoutData.scheduledDate),
        }
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error scheduling workout:', error);
      throw error;
    }
  }

  async getUserScheduledWorkouts(
    userId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<ScheduledWorkout[]> {
    try {
      let q = query(
        collection(db, SCHEDULED_WORKOUTS_COLLECTION),
        where('userId', '==', userId)
      );
      
      if (startDate) {
        q = query(q, where('scheduledDate', '>=', Timestamp.fromDate(startDate)));
      }
      
      if (endDate) {
        q = query(q, where('scheduledDate', '<=', Timestamp.fromDate(endDate)));
      }
      
      q = query(q, orderBy('scheduledDate', 'asc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as ScheduledWorkout[];
    } catch (error) {
      console.error('Error fetching scheduled workouts:', error);
      throw error;
    }
  }

  async updateScheduledWorkoutStatus(
    scheduledWorkoutId: string,
    status: ScheduledWorkout['status'],
    completedAt?: Date,
    duration?: number,
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, SCHEDULED_WORKOUTS_COLLECTION, scheduledWorkoutId);
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };
      
      if (completedAt) {
        updateData.completedAt = Timestamp.fromDate(completedAt);
      }
      
      if (duration !== undefined) {
        updateData.duration = duration;
      }
      
      if (notes !== undefined) {
        updateData.notes = notes;
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating scheduled workout:', error);
      throw error;
    }
  }

  // Workout Sessions (for tracking active workouts)
  async startWorkoutSession(userId: string, workoutId: string, scheduledWorkoutId?: string): Promise<string> {
    try {
      const session: Omit<WorkoutSession, 'id'> = {
        userId,
        workoutId,
        scheduledWorkoutId,
        startTime: new Date(),
        status: 'in_progress',
        exercises: [],
      };
      
      const docRef = await addDoc(
        collection(db, WORKOUT_SESSIONS_COLLECTION),
        {
          ...session,
          startTime: Timestamp.fromDate(session.startTime),
        }
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error starting workout session:', error);
      throw error;
    }
  }

  async completeWorkoutSession(
    sessionId: string,
    endTime: Date,
    exercises: WorkoutSession['exercises'],
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, WORKOUT_SESSIONS_COLLECTION, sessionId);
      await updateDoc(docRef, {
        endTime: Timestamp.fromDate(endTime),
        status: 'completed',
        exercises,
        notes,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error completing workout session:', error);
      throw error;
    }
  }

  // Personalized Recommendations
  async getRecommendedWorkouts(
    userId: string,
    goal: FitnessGoal,
    activityLevel: string,
    equipmentLevel: string,
    workoutDaysPerWeek: number
  ): Promise<WorkoutPlan[]> {
    try {
      // Get workout plans that match user's profile
      const plans = await this.getWorkoutPlans({
        goal,
        equipmentLevel: equipmentLevel as any,
      });
      
      // Filter and sort by user preferences
      const filtered = plans.filter(plan => {
        // Filter based on activity level and workout frequency
        const planFrequency = plan.workouts.length;
        
        if (activityLevel === 'sedentary' && planFrequency > 3) return false;
        if (activityLevel === 'light' && planFrequency > 4) return false;
        if (activityLevel === 'very_active' && planFrequency < 4) return false;
        
        return Math.abs(planFrequency - workoutDaysPerWeek) <= 1;
      });
      
      // Sort by popularity and recency
      return filtered.sort((a, b) => {
        // Prioritize newer plans
        return b.createdAt.getTime() - a.createdAt.getTime();
      }).slice(0, 5); // Return top 5 recommendations
    } catch (error) {
      console.error('Error getting recommended workouts:', error);
      throw error;
    }
  }
}

export const workoutService = new WorkoutService();
export default workoutService;