import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  DietPlan, 
  MealTemplate, 
  LocalFood, 
  FoodItem,
  FitnessGoal 
} from '@/types';

// Collections
const DIET_PLANS_COLLECTION = 'diet_plans';
const MEAL_TEMPLATES_COLLECTION = 'meal_templates';
const LOCAL_FOODS_COLLECTION = 'local_foods';
const FOOD_ITEMS_COLLECTION = 'food_items';
const USER_MEALS_COLLECTION = 'user_meals';

class DietService {
  // Diet Plans
  async getDietPlans(filters?: {
    goal?: FitnessGoal;
    calorieRange?: { min: number; max: number };
  }): Promise<DietPlan[]> {
    try {
      let q = query(collection(db, DIET_PLANS_COLLECTION));
      
      if (filters?.goal) {
        q = query(q, where('goal', '==', filters.goal));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      let plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as DietPlan[];
      
      // Filter by calorie range if provided
      if (filters?.calorieRange) {
        plans = plans.filter(plan => {
          const { min, max } = filters.calorieRange!;
          return plan.dailyCaloriesRange.min >= min && plan.dailyCaloriesRange.max <= max;
        });
      }
      
      return plans;
    } catch (error) {
      console.error('Error fetching diet plans:', error);
      throw error;
    }
  }

  async getDietPlan(planId: string): Promise<DietPlan | null> {
    try {
      const docRef = doc(db, DIET_PLANS_COLLECTION, planId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as DietPlan;
      }
      return null;
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      throw error;
    }
  }

  // Nigerian Local Foods
  async getLocalFoods(filters?: {
    category?: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'spices';
    availability?: 'common' | 'seasonal' | 'urban_only';
  }): Promise<LocalFood[]> {
    try {
      let q = query(collection(db, LOCAL_FOODS_COLLECTION));
      
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters?.availability) {
        q = query(q, where('availability', '==', filters.availability));
      }
      
      q = query(q, orderBy('name'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LocalFood[];
    } catch (error) {
      console.error('Error fetching local foods:', error);
      throw error;
    }
  }

  async searchLocalFoods(searchTerm: string): Promise<LocalFood[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // In production, you might want to use Algolia or implement this with Cloud Functions
      const q = query(
        collection(db, LOCAL_FOODS_COLLECTION),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(q);
      const allFoods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LocalFood[];
      
      // Client-side filtering for search
      const searchLower = searchTerm.toLowerCase();
      return allFoods.filter(food => 
        food.name.toLowerCase().includes(searchLower) ||
        food.localName.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching local foods:', error);
      throw error;
    }
  }

  // Meal Templates
  async getMealTemplates(filters?: {
    type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    maxCalories?: number;
    maxPrepTime?: number;
  }): Promise<MealTemplate[]> {
    try {
      let q = query(collection(db, MEAL_TEMPLATES_COLLECTION));
      
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      q = query(q, orderBy('name'));
      
      const querySnapshot = await getDocs(q);
      let templates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MealTemplate[];
      
      // Client-side filtering
      if (filters?.maxCalories) {
        templates = templates.filter(template => template.calories <= filters.maxCalories!);
      }
      
      if (filters?.maxPrepTime) {
        templates = templates.filter(template => template.prepTimeMinutes <= filters.maxPrepTime!);
      }
      
      return templates;
    } catch (error) {
      console.error('Error fetching meal templates:', error);
      throw error;
    }
  }

  async getMealTemplate(templateId: string): Promise<MealTemplate | null> {
    try {
      const docRef = doc(db, MEAL_TEMPLATES_COLLECTION, templateId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as MealTemplate;
      }
      return null;
    } catch (error) {
      console.error('Error fetching meal template:', error);
      throw error;
    }
  }

  // User Meal Logging
  async logUserMeal(userId: string, mealData: {
    templateId?: string;
    customName?: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: FoodItem[];
    totalCalories: number;
    mealDate: Date;
    notes?: string;
  }): Promise<string> {
    try {
      const userMeal = {
        userId,
        ...mealData,
        mealDate: Timestamp.fromDate(mealData.mealDate),
        loggedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(
        collection(db, USER_MEALS_COLLECTION),
        userMeal
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error logging user meal:', error);
      throw error;
    }
  }

  async getUserMeals(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    try {
      let q = query(
        collection(db, USER_MEALS_COLLECTION),
        where('userId', '==', userId)
      );
      
      if (startDate) {
        q = query(q, where('mealDate', '>=', Timestamp.fromDate(startDate)));
      }
      
      if (endDate) {
        q = query(q, where('mealDate', '<=', Timestamp.fromDate(endDate)));
      }
      
      q = query(q, orderBy('mealDate', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        mealDate: doc.data().mealDate?.toDate(),
        loggedAt: doc.data().loggedAt?.toDate(),
      }));
    } catch (error) {
      console.error('Error fetching user meals:', error);
      throw error;
    }
  }

  // Personalized Diet Recommendations
  async getRecommendedDietPlan(
    goal: FitnessGoal,
    currentWeight: number,
    targetWeight: number,
    activityLevel: string,
    age: number,
    sex: 'male' | 'female'
  ): Promise<DietPlan | null> {
    try {
      // Calculate BMR and daily calorie needs
      const bmr = this.calculateBMR(currentWeight, 175, age, sex); // Using average height
      const dailyCalories = this.calculateDailyCalories(bmr, activityLevel);
      
      // Adjust calories based on goal
      let targetCalories = dailyCalories;
      if (goal === 'lose_belly_fat' && currentWeight > targetWeight) {
        targetCalories = dailyCalories - 300; // Mild deficit
      } else if (goal === 'build_muscle') {
        targetCalories = dailyCalories + 200; // Mild surplus
      }
      
      // Find diet plan that matches calorie needs
      const plans = await this.getDietPlans({ goal });
      
      return plans.find(plan => 
        targetCalories >= plan.dailyCaloriesRange.min &&
        targetCalories <= plan.dailyCaloriesRange.max
      ) || plans[0] || null;
    } catch (error) {
      console.error('Error getting recommended diet plan:', error);
      throw error;
    }
  }

  // Helper methods for calorie calculations
  private calculateBMR(weight: number, height: number, age: number, sex: 'male' | 'female'): number {
    // Mifflin-St Jeor Equation
    if (sex === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  private calculateDailyCalories(bmr: number, activityLevel: string): number {
    const multipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9,
    };
    
    return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
  }
}

export const dietService = new DietService();
export default dietService;