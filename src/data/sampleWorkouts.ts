import { WorkoutPlan, Workout, Exercise } from '@/types';

// Sample Nigerian-themed exercises
export const nigerianExercises: Omit<Exercise, 'id'>[] = [
  // Upper Body Exercises
  {
    name: 'Lagos Traffic Push-ups',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    instructions: 'Like navigating Lagos traffic, push through with patience! Start in plank position, lower chest to ground, push back up. Keep core tight like you\'re bracing for a danfo stop.',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: [],
  },
  {
    name: 'Jollof Rice Pot Carry',
    sets: 3,
    reps: '30 seconds',
    restSeconds: 45,
    instructions: 'Hold a heavy object (or imagine carrying that big pot of jollof!) at chest level. Keep your core engaged and shoulders back. Feel the burn in your arms and core.',
    muscleGroups: ['biceps', 'core', 'shoulders'],
    equipment: ['dumbbells', 'kettlebell'],
  },
  {
    name: 'Agbada Arm Circles',
    sets: 2,
    reps: '20 each direction',
    restSeconds: 30,
    instructions: 'Extend arms wide like wearing a flowing agbada. Make large circles, feeling the stretch and burn in your shoulders. Perfect for warming up or cooling down.',
    muscleGroups: ['shoulders', 'upper_back'],
    equipment: [],
  },
  
  // Lower Body Exercises
  {
    name: 'Okada Rider Squats',
    sets: 4,
    reps: '15-20',
    restSeconds: 60,
    instructions: 'Like an okada rider navigating potholes! Feet shoulder-width apart, lower down as if sitting on a bike, then stand up powerfully. Keep chest up and knees tracking over toes.',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: [],
  },
  {
    name: 'Yam Pounding Lunges',
    sets: 3,
    reps: '12 each leg',
    restSeconds: 45,
    instructions: 'Step forward like pounding yam with a mortar! Lower back knee toward ground, then push through front heel to return. Alternate legs with power and control.',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: [],
  },
  {
    name: 'Calabar Carnival Calf Raises',
    sets: 3,
    reps: '20-25',
    restSeconds: 30,
    instructions: 'Rise up on your toes like dancing at Calabar Carnival! Feel the rhythm, push through your toes, hold at the top, then lower slowly. Keep the energy high!',
    muscleGroups: ['calves'],
    equipment: [],
  },
  
  // Core Exercises
  {
    name: 'Suya Stick Planks',
    sets: 3,
    reps: '30-60 seconds',
    restSeconds: 45,
    instructions: 'Hold steady like a suya stick over the fire! Maintain a straight line from head to heels. Keep core tight and breathe steadily. Feel the burn building.',
    muscleGroups: ['core', 'shoulders'],
    equipment: [],
  },
  {
    name: 'Ankara Fabric Twists',
    sets: 3,
    reps: '20 each side',
    restSeconds: 30,
    instructions: 'Twist your torso side to side like admiring beautiful ankara patterns! Sit with knees bent, lean back slightly, and rotate your core. Feel those obliques working.',
    muscleGroups: ['core', 'obliques'],
    equipment: [],
  },
  
  // Cardio Exercises
  {
    name: 'Afrobeats High Knees',
    sets: 4,
    reps: '30 seconds',
    restSeconds: 30,
    instructions: 'Pump those knees high to your favorite Afrobeats! Drive knees up toward chest, land softly on balls of feet. Keep the energy up like you\'re at a party!',
    muscleGroups: ['legs', 'core'],
    equipment: [],
  },
  {
    name: 'Market Run Burpees',
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    instructions: 'Fast like rushing to the market before closing time! Squat down, jump back to plank, do a push-up, jump feet forward, then jump up with arms overhead.',
    muscleGroups: ['full_body'],
    equipment: [],
  },
  
  // Gym Equipment Exercises
  {
    name: 'Palm Wine Barrel Deadlifts',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    instructions: 'Lift with the strength of carrying palm wine barrels! Feet hip-width apart, bend at hips and knees, grab the weight, then drive through heels to stand tall.',
    muscleGroups: ['hamstrings', 'glutes', 'lower_back'],
    equipment: ['barbell', 'dumbbells'],
  },
  {
    name: 'Kola Nut Chest Press',
    sets: 4,
    reps: '10-12',
    restSeconds: 75,
    instructions: 'Press with the power of traditional strength! Lie on bench, lower weight to chest level, then press up powerfully. Keep shoulder blades pinched together.',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: ['barbell', 'dumbbells', 'bench'],
  },
];

// Sample workout routines
export const nigerianWorkouts: Omit<Workout, 'id'>[] = [
  {
    name: 'Lagos Streets HIIT',
    muscleGroups: ['full_body'],
    durationMinutes: 20,
    exercises: [
      {
        id: 'market_run_burpees',
        name: 'Market Run Burpees',
        sets: 3,
        reps: '8-12',
        restSeconds: 60,
        instructions: 'Fast like rushing to the market before closing time!',
        muscleGroups: ['full_body'],
      },
      {
        id: 'afrobeats_high_knees',
        name: 'Afrobeats High Knees',
        sets: 4,
        reps: '30 seconds',
        restSeconds: 30,
        instructions: 'Pump those knees high to your favorite Afrobeats!',
        muscleGroups: ['legs', 'core'],
      },
      {
        id: 'lagos_traffic_pushups',
        name: 'Lagos Traffic Push-ups',
        sets: 3,
        reps: '10-15',
        restSeconds: 60,
        instructions: 'Like navigating Lagos traffic, push through with patience!',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
      },
    ],
    instructions: 'High-intensity workout inspired by the hustle of Lagos streets. Perfect for busy Nigerians who want maximum results in minimal time.',
    difficulty: 'intermediate',
    equipment: [],
  },
  
  {
    name: 'Afrobeats Dance Cardio',
    muscleGroups: ['full_body', 'legs'],
    durationMinutes: 30,
    exercises: [
      {
        id: 'afrobeats_warmup',
        name: 'Afrobeats Warm-up',
        sets: 1,
        reps: '5 minutes',
        restSeconds: 0,
        instructions: 'Start with gentle movements to your favorite Afrobeats songs. Get your body moving and grooving!',
        muscleGroups: ['full_body'],
      },
      {
        id: 'azonto_steps',
        name: 'Azonto Dance Steps',
        sets: 3,
        reps: '2 minutes',
        restSeconds: 30,
        instructions: 'Classic Azonto moves with high energy! Work those legs and core while having fun.',
        muscleGroups: ['legs', 'core'],
      },
      {
        id: 'shaku_shaku_cardio',
        name: 'Shaku Shaku Cardio',
        sets: 3,
        reps: '2 minutes',
        restSeconds: 30,
        instructions: 'Feel the beat! Move your legs and arms to the Shaku Shaku rhythm while keeping your heart rate up.',
        muscleGroups: ['full_body'],
      },
    ],
    instructions: 'Fun cardio workout featuring popular Nigerian dance moves. Get fit while celebrating our culture!',
    difficulty: 'beginner',
    equipment: [],
  },
  
  {
    name: 'Nigerian Strength Builder',
    muscleGroups: ['chest', 'back', 'legs'],
    durationMinutes: 45,
    exercises: [
      {
        id: 'palm_wine_deadlifts',
        name: 'Palm Wine Barrel Deadlifts',
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        instructions: 'Lift with the strength of carrying palm wine barrels!',
        muscleGroups: ['hamstrings', 'glutes', 'lower_back'],
        equipment: ['barbell', 'dumbbells'],
      },
      {
        id: 'kola_nut_chest_press',
        name: 'Kola Nut Chest Press',
        sets: 4,
        reps: '10-12',
        restSeconds: 75,
        instructions: 'Press with the power of traditional strength!',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        equipment: ['barbell', 'dumbbells', 'bench'],
      },
      {
        id: 'okada_rider_squats',
        name: 'Okada Rider Squats',
        sets: 4,
        reps: '15-20',
        restSeconds: 60,
        instructions: 'Like an okada rider navigating potholes!',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
      },
    ],
    instructions: 'Build strength with exercises inspired by Nigerian culture. Perfect for intermediate to advanced trainees.',
    difficulty: 'intermediate',
    equipment: ['barbell', 'dumbbells', 'bench'],
  },
];

// Sample workout plans for seeding (IDs will be generated during seeding)
export const nigerianWorkoutPlans = [
  {
    name: 'Lagos Hustle Fat Loss',
    goal: 'lose_belly_fat' as const,
    durationWeeks: 8,
    difficulty: 'beginner' as const,
    equipmentLevel: 'home' as const,
    workouts: [], // Will be populated during seeding with actual workout IDs
    description: 'Burn fat with the energy of Lagos hustle! This 8-week plan combines high-intensity workouts with fun Afrobeats cardio sessions. Perfect for busy Nigerians who want to lose weight at home.',
    estimatedTimeToGoal: '6-8 weeks',
    workoutTypes: ['lagos_hiit', 'afrobeats_cardio'], // Reference for seeding
  },
  
  {
    name: 'Nigerian Strongman Builder',
    goal: 'build_muscle' as const,
    durationWeeks: 12,
    difficulty: 'intermediate' as const,
    equipmentLevel: 'full_gym' as const,
    workouts: [], // Will be populated during seeding
    description: 'Build muscle like a traditional Nigerian strongman! This 12-week program focuses on compound movements with cultural significance. Designed for gym-goers who want serious strength gains.',
    estimatedTimeToGoal: '10-12 weeks',
    workoutTypes: ['nigerian_strength'], // Reference for seeding
  },
  
  {
    name: 'Afrobeats Fitness Journey',
    goal: 'improve_cardio' as const,
    durationWeeks: 6,
    difficulty: 'beginner' as const,
    equipmentLevel: 'home' as const,
    workouts: [], // Will be populated during seeding
    description: 'Improve your cardiovascular health while celebrating Nigerian music! This fun 6-week program uses dance and bodyweight exercises to boost your fitness level.',
    estimatedTimeToGoal: '4-6 weeks',
    workoutTypes: ['afrobeats_cardio'], // Reference for seeding
  },
  
  {
    name: 'Lagos Corporate Warrior',
    goal: 'strength_training' as const,
    durationWeeks: 10,
    difficulty: 'intermediate' as const,
    equipmentLevel: 'basic_gym' as const,
    workouts: [], // Will be populated during seeding
    description: 'Perfect for busy Lagos professionals! Efficient workouts that build strength and endurance. Mix of cardio and strength training that fits into your schedule.',
    estimatedTimeToGoal: '8-10 weeks',
    workoutTypes: ['lagos_hiit', 'afrobeats_cardio', 'nigerian_strength'], // Reference for seeding
  },
];