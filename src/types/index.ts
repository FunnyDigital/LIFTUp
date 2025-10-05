// User types
export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  profile: UserProfile;
  subscription: SubscriptionStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  sex: 'male' | 'female';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoal: FitnessGoal;
  location: string;
  workoutDaysPerWeek: number;
  preferredUnits: 'metric' | 'imperial';
}

// Fitness goals
export type FitnessGoal = 
  | 'lose_belly_fat'
  | 'build_muscle'
  | 'build_lean_mass'
  | 'improve_cardio'
  | 'strength_training'
  | 'weight_maintenance';

// Workout types
export interface WorkoutPlan {
  id: string;
  name: string;
  goal: FitnessGoal;
  durationWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipmentLevel: 'home' | 'basic_gym' | 'full_gym';
  workouts: Workout[];
  description: string;
  estimatedTimeToGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workout {
  id: string;
  name: string;
  muscleGroups: string[];
  durationMinutes: number;
  exercises: Exercise[];
  instructions: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8-12", "30 seconds", "to failure"
  restSeconds: number;
  instructions: string;
  videoUrl?: string;
  muscleGroups: string[];
  equipment?: string[];
}

// Diet types
export interface DietPlan {
  id: string;
  goal: FitnessGoal;
  name: string;
  dailyCaloriesRange: {
    min: number;
    max: number;
  };
  macroSplit: {
    protein: number; // percentage
    carbs: number;   // percentage
    fats: number;    // percentage
  };
  mealTemplates: MealTemplate[];
  localFoodItems: LocalFood[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealTemplate {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  ingredients: FoodItem[];
  instructions: string;
  prepTimeMinutes: number;
  servings: number;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isLocal: boolean;
}

export interface LocalFood {
  id: string;
  name: string;
  localName: string; // Nigerian name
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'spices';
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  commonPreparations: string[];
  availability: 'common' | 'seasonal' | 'urban_only';
}

// Subscription types
export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan;
  currentPeriodStart: string; // ISO date string
  currentPeriodEnd: string; // ISO date string
  paystackCustomerId?: string;
  paystackSubscriptionId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: 'monthly' | 'quarterly' | 'yearly';
  priceNGN: number;
  features: string[];
  isPopular?: boolean;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: 'NGN';
  paystackReference: string;
  status: 'pending' | 'success' | 'failed';
  planId: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Progress tracking types
export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFatPercentage?: number;
  measurements?: BodyMeasurements;
  photos?: ProgressPhoto[];
  notes?: string;
}

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  neck?: number;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  type: 'front' | 'side' | 'back';
  uploadedAt: Date;
}

// Scheduling types
export interface ScheduledWorkout {
  id: string;
  userId: string;
  workoutId: string;
  planId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'skipped' | 'in_progress';
  completedAt?: Date;
  duration?: number; // actual duration in minutes
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  scheduledWorkoutId?: string;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'cancelled';
  exercises: Array<{
    exerciseId: string;
    sets: Array<{
      reps: number;
      weight?: number;
      duration?: number; // for time-based exercises
      completed: boolean;
    }>;
    notes?: string;
  }>;
  notes?: string;
  totalDuration?: number; // in minutes
  caloriesBurned?: number;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { phoneNumber: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  PersonalInfo: undefined;
  BodyMetrics: undefined;
  FitnessGoals: undefined;
  ActivityLevel: undefined;
  WorkoutPreferences: undefined;
  Summary: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Calendar: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutDetails: { workoutId: string };
  WorkoutSession: { workoutId: string };
  ExerciseDetails: { exerciseId: string };
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    age: number;
    sex: 'male' | 'female';
  };
  bodyMetrics: {
    height: number;
    weight: number;
  };
  preferences: {
    fitnessGoal: FitnessGoal;
    activityLevel: UserProfile['activityLevel'];
    workoutDaysPerWeek: number;
    location: string;
    preferredUnits: 'metric' | 'imperial';
  };
}

// Notification types
export interface NotificationPayload {
  title: string;
  body: string;
  data?: {
    type: 'workout_reminder' | 'subscription_reminder' | 'new_content';
    workoutId?: string;
    planId?: string;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}