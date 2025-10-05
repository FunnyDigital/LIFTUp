import { UserProfile, FitnessGoal, WorkoutPlan, Workout } from '@/types';

interface WorkoutRecommendation {
  name: string;
  description: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  exercises: string[];
  equipment: string[];
}

/**
 * Service to generate personalized workouts based on user's profile
 */
class WorkoutGenerationService {
  /**
   * Generate personalized workout recommendations based on user profile
   */
  generateWorkoutsForUser(profile: UserProfile): WorkoutRecommendation[] {
    const { fitnessGoal, activityLevel, workoutDaysPerWeek } = profile;
    
    const workouts: WorkoutRecommendation[] = [];
    
    // Determine difficulty based on activity level
    const difficulty = this.getDifficultyFromActivityLevel(activityLevel);
    
    // Generate workouts based on fitness goal
    switch (fitnessGoal) {
      case 'lose_belly_fat':
        workouts.push(...this.generateFatLossWorkouts(workoutDaysPerWeek, difficulty));
        break;
      case 'build_muscle':
        workouts.push(...this.generateMuscleBuildingWorkouts(workoutDaysPerWeek, difficulty));
        break;
      case 'build_lean_mass':
        workouts.push(...this.generateLeanMassWorkouts(workoutDaysPerWeek, difficulty));
        break;
      case 'improve_cardio':
        workouts.push(...this.generateCardioWorkouts(workoutDaysPerWeek, difficulty));
        break;
      case 'strength_training':
        workouts.push(...this.generateStrengthWorkouts(workoutDaysPerWeek, difficulty));
        break;
      case 'weight_maintenance':
        workouts.push(...this.generateMaintenanceWorkouts(workoutDaysPerWeek, difficulty));
        break;
      default:
        workouts.push(...this.generateGeneralWorkouts(workoutDaysPerWeek, difficulty));
    }
    
    return workouts;
  }
  
  /**
   * Get difficulty level from activity level
   */
  private getDifficultyFromActivityLevel(
    activityLevel: UserProfile['activityLevel']
  ): 'beginner' | 'intermediate' | 'advanced' {
    switch (activityLevel) {
      case 'sedentary':
      case 'light':
        return 'beginner';
      case 'moderate':
      case 'active':
        return 'intermediate';
      case 'very_active':
        return 'advanced';
      default:
        return 'beginner';
    }
  }
  
  /**
   * Generate workouts for fat loss
   */
  private generateFatLossWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    return [
      {
        name: 'Lagos Streets HIIT 🏃',
        description: 'High-intensity interval training inspired by the hustle of Lagos. Burns maximum calories in minimum time.',
        durationMinutes: difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 30 : 40,
        difficulty,
        muscleGroups: ['full_body', 'legs', 'core'],
        exercises: ['Burpees', 'Mountain climbers', 'Jump squats', 'High knees', 'Plank jacks'],
        equipment: [],
      },
      {
        name: 'Afrobeats Cardio Dance 💃',
        description: 'Fun, high-energy cardio workout featuring popular Nigerian dance moves. Burn fat while dancing to Wizkid and Burna Boy.',
        durationMinutes: 30,
        difficulty,
        muscleGroups: ['full_body', 'legs'],
        exercises: ['Shaku shaku', 'Zanku', 'Leg work', 'Jump rope', 'Dance combos'],
        equipment: [],
      },
      {
        name: 'Full Body Fat Burn',
        description: 'Compound movements targeting multiple muscle groups for maximum calorie burn.',
        durationMinutes: 40,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Squats', 'Push-ups', 'Lunges', 'Rows', 'Planks'],
        equipment: ['dumbbells', 'mat'],
      },
    ];
  }
  
  /**
   * Generate workouts for muscle building
   */
  private generateMuscleBuildingWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    if (daysPerWeek >= 4) {
      // Split routine for 4+ days
      return [
        {
          name: 'Chest & Triceps Power 💪',
          description: 'Build a strong chest and defined arms with this push-focused workout.',
          durationMinutes: 60,
          difficulty,
          muscleGroups: ['chest', 'triceps', 'shoulders'],
          exercises: ['Bench press', 'Incline dumbbell press', 'Cable flys', 'Tricep dips', 'Overhead extension'],
          equipment: ['barbell', 'dumbbells', 'bench'],
        },
        {
          name: 'Back & Biceps Mass Builder',
          description: 'Develop a wide back and thick biceps with compound pulling movements.',
          durationMinutes: 60,
          difficulty,
          muscleGroups: ['back', 'biceps'],
          exercises: ['Deadlifts', 'Pull-ups', 'Barbell rows', 'Hammer curls', 'Cable rows'],
          equipment: ['barbell', 'dumbbells', 'pull-up bar'],
        },
        {
          name: 'Leg Day - Nigerian Strength 🦵',
          description: 'Build powerful legs with squats and Nigerian-style leg work.',
          durationMinutes: 60,
          difficulty,
          muscleGroups: ['legs', 'glutes'],
          exercises: ['Squats', 'Romanian deadlifts', 'Leg press', 'Lunges', 'Calf raises'],
          equipment: ['barbell', 'dumbbells', 'leg press'],
        },
        {
          name: 'Shoulders & Arms Sculptor',
          description: 'Complete shoulder and arm development for that athletic look.',
          durationMinutes: 50,
          difficulty,
          muscleGroups: ['shoulders', 'arms'],
          exercises: ['Overhead press', 'Lateral raises', 'Bicep curls', 'Tricep pushdowns', 'Face pulls'],
          equipment: ['dumbbells', 'cables'],
        },
      ];
    } else {
      // Full body for 2-3 days
      return [
        {
          name: 'Full Body Strength A',
          description: 'Complete muscle-building workout targeting all major muscle groups.',
          durationMinutes: 60,
          difficulty,
          muscleGroups: ['full_body'],
          exercises: ['Squats', 'Bench press', 'Rows', 'Overhead press', 'Bicep curls'],
          equipment: ['barbell', 'dumbbells'],
        },
        {
          name: 'Full Body Strength B',
          description: 'Alternative full-body workout with different exercise variations.',
          durationMinutes: 60,
          difficulty,
          muscleGroups: ['full_body'],
          exercises: ['Deadlifts', 'Pull-ups', 'Dumbbell press', 'Lunges', 'Tricep dips'],
          equipment: ['barbell', 'dumbbells', 'pull-up bar'],
        },
      ];
    }
  }
  
  /**
   * Generate workouts for lean mass
   */
  private generateLeanMassWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    return [
      {
        name: 'Lean Muscle Circuit',
        description: 'Build lean muscle with high-rep compound movements and short rest periods.',
        durationMinutes: 45,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Goblet squats', 'Push-ups', 'Kettlebell swings', 'Rows', 'Planks'],
        equipment: ['dumbbells', 'kettlebell'],
      },
      {
        name: 'Functional Strength Training',
        description: 'Develop functional, lean muscle with Nigerian-style training.',
        durationMinutes: 50,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Front squats', 'Dumbbell press', 'Romanian deadlifts', 'Pull-ups', 'Core work'],
        equipment: ['barbell', 'dumbbells', 'pull-up bar'],
      },
    ];
  }
  
  /**
   * Generate cardio-focused workouts
   */
  private generateCardioWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    return [
      {
        name: 'Naija Cardio Blast 🔥',
        description: 'Nigerian-inspired cardio combining traditional movements with modern HIIT.',
        durationMinutes: 30,
        difficulty,
        muscleGroups: ['full_body', 'legs'],
        exercises: ['Running', 'Jump rope', 'Burpees', 'High knees', 'Mountain climbers'],
        equipment: ['jump rope'],
      },
      {
        name: 'Steady State Endurance',
        description: 'Build cardiovascular endurance with sustained moderate-intensity work.',
        durationMinutes: 40,
        difficulty,
        muscleGroups: ['legs'],
        exercises: ['Jogging', 'Cycling', 'Rowing', 'Stair climbing'],
        equipment: [],
      },
    ];
  }
  
  /**
   * Generate strength-focused workouts
   */
  private generateStrengthWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    return [
      {
        name: 'Powerlifting Basics',
        description: 'Build raw strength with the big three compound lifts.',
        durationMinutes: 70,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Squats', 'Bench press', 'Deadlifts', 'Overhead press', 'Barbell rows'],
        equipment: ['barbell', 'bench', 'squat rack'],
      },
      {
        name: 'Nigerian Strongman Training',
        description: 'Functional strength training inspired by traditional Nigerian strength exercises.',
        durationMinutes: 60,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Farmer walks', 'Tire flips', 'Sandbag carries', 'Heavy rows', 'Loaded carries'],
        equipment: ['dumbbells', 'sandbag'],
      },
    ];
  }
  
  /**
   * Generate maintenance workouts
   */
  private generateMaintenanceWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    return [
      {
        name: 'Balanced Full Body',
        description: 'Well-rounded workout to maintain fitness and muscle mass.',
        durationMinutes: 45,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Squats', 'Push-ups', 'Rows', 'Lunges', 'Core work'],
        equipment: ['dumbbells'],
      },
      {
        name: 'Active Recovery & Mobility',
        description: 'Light movement to maintain fitness while allowing recovery.',
        durationMinutes: 30,
        difficulty: 'beginner',
        muscleGroups: ['full_body'],
        exercises: ['Yoga', 'Stretching', 'Light cardio', 'Mobility drills'],
        equipment: ['mat'],
      },
    ];
  }
  
  /**
   * Generate general fitness workouts
   */
  private generateGeneralWorkouts(
    daysPerWeek: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkoutRecommendation[] {
    return [
      {
        name: 'General Fitness Workout',
        description: 'Balanced workout for overall fitness and health.',
        durationMinutes: 45,
        difficulty,
        muscleGroups: ['full_body'],
        exercises: ['Squats', 'Push-ups', 'Lunges', 'Planks', 'Cardio'],
        equipment: [],
      },
    ];
  }
  
  /**
   * Get today's recommended workout based on day of week
   */
  getTodaysWorkout(profile: UserProfile): WorkoutRecommendation | null {
    const workouts = this.generateWorkoutsForUser(profile);
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    
    // Return workout based on day rotation
    if (workouts.length === 0) return null;
    
    const workoutIndex = dayOfWeek % workouts.length;
    return workouts[workoutIndex];
  }
  
  /**
   * Calculate estimated time to reach fitness goal
   */
  estimateTimeToGoal(profile: UserProfile): string {
    const { fitnessGoal, activityLevel, workoutDaysPerWeek } = profile;
    
    // Base estimates in weeks
    let baseWeeks = 12;
    
    switch (fitnessGoal) {
      case 'lose_belly_fat':
        baseWeeks = 12;
        break;
      case 'build_muscle':
        baseWeeks = 16;
        break;
      case 'build_lean_mass':
        baseWeeks = 14;
        break;
      case 'improve_cardio':
        baseWeeks = 8;
        break;
      case 'strength_training':
        baseWeeks = 12;
        break;
      case 'weight_maintenance':
        baseWeeks = 4;
        break;
    }
    
    // Adjust based on activity level
    const activityMultiplier = activityLevel === 'sedentary' || activityLevel === 'light' ? 1.3 :
                               activityLevel === 'moderate' || activityLevel === 'active' ? 1.0 : 0.8;
    
    // Adjust based on workout frequency
    const frequencyMultiplier = workoutDaysPerWeek < 3 ? 1.5 :
                               workoutDaysPerWeek < 5 ? 1.0 : 0.8;
    
    const adjustedWeeks = Math.ceil(baseWeeks * activityMultiplier * frequencyMultiplier);
    
    if (adjustedWeeks <= 8) {
      return `${adjustedWeeks} weeks`;
    } else {
      const months = Math.ceil(adjustedWeeks / 4);
      return `${months} months`;
    }
  }
  
  /**
   * Calculate daily calorie target
   */
  calculateDailyCalories(profile: UserProfile): number {
    const { weight, height, age, sex, activityLevel, fitnessGoal } = profile;
    
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number;
    if (sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    let tdee = bmr * activityMultipliers[activityLevel];
    
    // Adjust for goal
    switch (fitnessGoal) {
      case 'lose_belly_fat':
        tdee *= 0.8; // 20% deficit
        break;
      case 'build_muscle':
        tdee *= 1.15; // 15% surplus
        break;
      case 'build_lean_mass':
        tdee *= 1.05; // 5% surplus
        break;
      case 'weight_maintenance':
        // No adjustment
        break;
      default:
        tdee *= 1.05;
    }
    
    return Math.round(tdee);
  }
}

export const workoutGenerationService = new WorkoutGenerationService();
export default workoutGenerationService;
