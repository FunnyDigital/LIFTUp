import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { nigerianExercises, nigerianWorkouts, nigerianWorkoutPlans } from '@/data/sampleWorkouts';
import { nigerianLocalFoods, nigerianMealTemplates, nigerianDietPlans } from '@/data/sampleFoods';

// Flag to prevent accidental re-seeding in production
const ALLOW_SEEDING = __DEV__ || process.env.NODE_ENV === 'development';

class DataSeeder {
  private async addDocumentWithId<T extends Record<string, any>>(
    collectionName: string,
    data: T,
    customId?: string
  ): Promise<string> {
    try {
      if (customId) {
        await setDoc(doc(db, collectionName, customId), {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        return customId;
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        return docRef.id;
      }
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  async seedExercises(): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('Data seeding is disabled in production');
      return;
    }

    console.log('Seeding Nigerian exercises...');
    
    try {
      for (const exercise of nigerianExercises) {
        await this.addDocumentWithId('exercises', exercise);
      }
      console.log(`✅ Successfully seeded ${nigerianExercises.length} exercises`);
    } catch (error) {
      console.error('❌ Error seeding exercises:', error);
      throw error;
    }
  }

  async seedWorkouts(): Promise<string[]> {
    if (!ALLOW_SEEDING) {
      console.warn('Data seeding is disabled in production');
      return [];
    }

    console.log('Seeding Nigerian workouts...');
    const workoutIds: string[] = [];
    
    try {
      for (const workout of nigerianWorkouts) {
        const workoutId = await this.addDocumentWithId('workouts', workout);
        workoutIds.push(workoutId);
      }
      console.log(`✅ Successfully seeded ${nigerianWorkouts.length} workouts`);
      return workoutIds;
    } catch (error) {
      console.error('❌ Error seeding workouts:', error);
      throw error;
    }
  }

  async seedWorkoutPlans(workoutIds: string[]): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('Data seeding is disabled in production');
      return;
    }

    console.log('Seeding Nigerian workout plans...');
    
    try {
      for (let i = 0; i < nigerianWorkoutPlans.length; i++) {
        const plan = nigerianWorkoutPlans[i];
        
        // Map workouts to their IDs (simplified mapping for demo)
        const workoutsWithIds = plan.workouts.map((workout, index) => ({
          ...workout,
          id: workoutIds[index] || `workout_${index}`,
        }));
        
        const planWithIds = {
          ...plan,
          workouts: workoutsWithIds,
        };
        
        await this.addDocumentWithId('workout_plans', planWithIds);
      }
      console.log(`✅ Successfully seeded ${nigerianWorkoutPlans.length} workout plans`);
    } catch (error) {
      console.error('❌ Error seeding workout plans:', error);
      throw error;
    }
  }

  async seedLocalFoods(): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('Data seeding is disabled in production');
      return;
    }

    console.log('Seeding Nigerian local foods...');
    
    try {
      for (const food of nigerianLocalFoods) {
        await this.addDocumentWithId('local_foods', food);
      }
      console.log(`✅ Successfully seeded ${nigerianLocalFoods.length} local foods`);
    } catch (error) {
      console.error('❌ Error seeding local foods:', error);
      throw error;
    }
  }

  async seedMealTemplates(): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('Data seeding is disabled in production');
      return;
    }

    console.log('Seeding Nigerian meal templates...');
    
    try {
      for (const meal of nigerianMealTemplates) {
        await this.addDocumentWithId('meal_templates', meal);
      }
      console.log(`✅ Successfully seeded ${nigerianMealTemplates.length} meal templates`);
    } catch (error) {
      console.error('❌ Error seeding meal templates:', error);
      throw error;
    }
  }

  async seedDietPlans(): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('Data seeding is disabled in production');
      return;
    }

    console.log('Seeding Nigerian diet plans...');
    
    try {
      for (const plan of nigerianDietPlans) {
        await this.addDocumentWithId('diet_plans', plan);
      }
      console.log(`✅ Successfully seeded ${nigerianDietPlans.length} diet plans`);
    } catch (error) {
      console.error('❌ Error seeding diet plans:', error);
      throw error;
    }
  }

  // Master seeding function
  async seedAllData(): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('❌ Data seeding is disabled in production');
      return;
    }

    console.log('🌱 Starting Nigerian fitness data seeding...');
    
    try {
      // Seed in order to maintain references
      await this.seedExercises();
      const workoutIds = await this.seedWorkouts();
      await this.seedWorkoutPlans(workoutIds);
      
      await this.seedLocalFoods();
      await this.seedMealTemplates();
      await this.seedDietPlans();
      
      console.log('🎉 All Nigerian fitness data seeded successfully!');
      console.log('🇳🇬 Your app is now loaded with authentic Nigerian workout and diet content!');
    } catch (error) {
      console.error('💥 Error during data seeding:', error);
      throw error;
    }
  }

  // Utility function to check if data already exists
  async checkDataExists(): Promise<{
    exercises: boolean;
    workouts: boolean;
    workoutPlans: boolean;
    localFoods: boolean;
    mealTemplates: boolean;
    dietPlans: boolean;
  }> {
    // This would need to be implemented with Firestore queries
    // For now, return false to allow seeding
    return {
      exercises: false,
      workouts: false,
      workoutPlans: false,
      localFoods: false,
      mealTemplates: false,
      dietPlans: false,
    };
  }

  // Function to clear all seeded data (use with caution!)
  async clearAllData(): Promise<void> {
    if (!ALLOW_SEEDING) {
      console.warn('❌ Data clearing is disabled in production');
      return;
    }

    console.warn('🗑️ This will clear all seeded data. Use with caution!');
    // Implementation would involve deleting collections
    // Not implemented for safety
  }
}

export const dataSeeder = new DataSeeder();
export default dataSeeder;

// Convenience function for quick seeding during development
export const quickSeedForDevelopment = async (): Promise<void> => {
  if (__DEV__) {
    try {
      await dataSeeder.seedAllData();
    } catch (error) {
      console.error('Quick seed failed:', error);
    }
  }
};