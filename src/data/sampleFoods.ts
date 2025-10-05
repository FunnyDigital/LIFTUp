import { LocalFood, MealTemplate, DietPlan } from '@/types';

// Nigerian Local Foods Database
export const nigerianLocalFoods: Omit<LocalFood, 'id'>[] = [
  // Proteins
  {
    name: 'Stockfish',
    localName: 'Okporoko',
    category: 'protein',
    nutritionPer100g: {
      calories: 290,
      protein: 62.8,
      carbs: 0,
      fats: 2.4,
      fiber: 0,
    },
    commonPreparations: ['Pepper soup', 'Egusi soup', 'Bitter leaf soup'],
    availability: 'common',
  },
  {
    name: 'Catfish',
    localName: 'Eja Aro',
    category: 'protein',
    nutritionPer100g: {
      calories: 105,
      protein: 18.7,
      carbs: 0,
      fats: 2.9,
      fiber: 0,
    },
    commonPreparations: ['Pepper soup', 'Grilled', 'Stewed'],
    availability: 'common',
  },
  {
    name: 'Bush Meat',
    localName: 'Inyama Ohia',
    category: 'protein',
    nutritionPer100g: {
      calories: 180,
      protein: 25.2,
      carbs: 0,
      fats: 8.1,
      fiber: 0,
    },
    commonPreparations: ['Pepper soup', 'Suya spice', 'Native soup'],
    availability: 'seasonal',
  },
  {
    name: 'Snails',
    localName: 'Eju/Umang',
    category: 'protein',
    nutritionPer100g: {
      calories: 90,
      protein: 16.1,
      carbs: 2.0,
      fats: 1.4,
      fiber: 0,
    },
    commonPreparations: ['Pepper soup', 'Native soup', 'Egusi soup'],
    availability: 'common',
  },
  
  // Carbohydrates
  {
    name: 'Pounded Yam',
    localName: 'Iyan',
    category: 'carbs',
    nutritionPer100g: {
      calories: 118,
      protein: 1.5,
      carbs: 28.0,
      fats: 0.2,
      fiber: 4.1,
    },
    commonPreparations: ['Served with soup', 'Native preparation'],
    availability: 'common',
  },
  {
    name: 'Garri',
    localName: 'Garri',
    category: 'carbs',
    nutritionPer100g: {
      calories: 357,
      protein: 2.8,
      carbs: 84.0,
      fats: 0.5,
      fiber: 2.8,
    },
    commonPreparations: ['Eba', 'Garri soakings', 'Garri and groundnut'],
    availability: 'common',
  },
  {
    name: 'Plantain',
    localName: 'Ogede',
    category: 'carbs',
    nutritionPer100g: {
      calories: 122,
      protein: 1.3,
      carbs: 31.9,
      fats: 0.4,
      fiber: 2.3,
    },
    commonPreparations: ['Fried plantain', 'Boiled', 'Plantain porridge'],
    availability: 'common',
  },
  {
    name: 'Sweet Potato',
    localName: 'Anyu/Oduku',
    category: 'carbs',
    nutritionPer100g: {
      calories: 86,
      protein: 1.6,
      carbs: 20.1,
      fats: 0.1,
      fiber: 3.0,
    },
    commonPreparations: ['Roasted', 'Boiled', 'Porridge'],
    availability: 'common',
  },
  
  // Vegetables
  {
    name: 'Bitter Leaf',
    localName: 'Onugbu',
    category: 'vegetables',
    nutritionPer100g: {
      calories: 22,
      protein: 3.8,
      carbs: 1.0,
      fats: 0.4,
      fiber: 11.2,
    },
    commonPreparations: ['Bitter leaf soup', 'Ofe onugbu', 'Pepper soup'],
    availability: 'common',
  },
  {
    name: 'Pumpkin Leaves',
    localName: 'Ugwu',
    category: 'vegetables',
    nutritionPer100g: {
      calories: 19,
      protein: 2.8,
      carbs: 2.9,
      fats: 0.3,
      fiber: 1.8,
    },
    commonPreparations: ['Ugwu soup', 'Egusi soup', 'Stir-fried'],
    availability: 'common',
  },
  {
    name: 'Water Leaf',
    localName: 'Mmiri mmiri',
    category: 'vegetables',
    nutritionPer100g: {
      calories: 18,
      protein: 2.5,
      carbs: 3.4,
      fats: 0.2,
      fiber: 1.5,
    },
    commonPreparations: ['Water leaf soup', 'Native soup', 'Pepper soup'],
    availability: 'common',
  },
  
  // Fruits
  {
    name: 'African Star Apple',
    localName: 'Agbalumo/Udara',
    category: 'fruits',
    nutritionPer100g: {
      calories: 67,
      protein: 1.5,
      carbs: 16.0,
      fats: 0.3,
      fiber: 3.0,
    },
    commonPreparations: ['Fresh', 'Juice'],
    availability: 'seasonal',
  },
  {
    name: 'African Pear',
    localName: 'Ube',
    category: 'fruits',
    nutritionPer100g: {
      calories: 160,
      protein: 2.0,
      carbs: 7.9,
      fats: 14.7,
      fiber: 7.3,
    },
    commonPreparations: ['Roasted', 'Boiled with corn'],
    availability: 'seasonal',
  },
  {
    name: 'Tiger Nut',
    localName: 'Aya/Aki Hausa',
    category: 'fruits',
    nutritionPer100g: {
      calories: 386,
      protein: 4.2,
      carbs: 49.2,
      fats: 18.4,
      fiber: 33.0,
    },
    commonPreparations: ['Tiger nut milk', 'Snack', 'Kunnu'],
    availability: 'common',
  },
  
  // Spices
  {
    name: 'Uziza Leaves',
    localName: 'Uziza',
    category: 'spices',
    nutritionPer100g: {
      calories: 25,
      protein: 2.1,
      carbs: 4.8,
      fats: 0.5,
      fiber: 1.2,
    },
    commonPreparations: ['Pepper soup spice', 'Native soup', 'Seasoning'],
    availability: 'common',
  },
  {
    name: 'Cameroon Pepper',
    localName: 'Ose Nsukka',
    category: 'spices',
    nutritionPer100g: {
      calories: 40,
      protein: 2.0,
      carbs: 8.8,
      fats: 0.4,
      fiber: 1.5,
    },
    commonPreparations: ['Ground pepper', 'Soup seasoning', 'Stew base'],
    availability: 'common',
  },
];

// Nigerian Meal Templates
export const nigerianMealTemplates: Omit<MealTemplate, 'id'>[] = [
  // Breakfast
  {
    name: 'Nigerian Breakfast Bowl',
    type: 'breakfast',
    calories: 420,
    ingredients: [
      {
        id: 'plantain',
        name: 'Fried Plantain',
        quantity: '100g',
        calories: 122,
        protein: 1.3,
        carbs: 31.9,
        fats: 0.4,
        isLocal: true,
      },
      {
        id: 'eggs',
        name: 'Scrambled Eggs',
        quantity: '2 large',
        calories: 180,
        protein: 12.6,
        carbs: 1.2,
        fats: 12.6,
        isLocal: false,
      },
      {
        id: 'bread',
        name: 'Bread Slice',
        quantity: '2 slices',
        calories: 118,
        protein: 3.6,
        carbs: 22.0,
        fats: 1.2,
        isLocal: false,
      },
    ],
    instructions: '1. Slice and fry plantain until golden\n2. Scramble eggs with minimal oil\n3. Serve with toasted bread\n4. Perfect Nigerian breakfast for energy!',
    prepTimeMinutes: 15,
    servings: 1,
  },
  
  {
    name: 'Akamu with Moi Moi',
    type: 'breakfast',
    calories: 380,
    ingredients: [
      {
        id: 'akamu',
        name: 'Akamu (Corn porridge)',
        quantity: '250ml',
        calories: 150,
        protein: 3.2,
        carbs: 35.0,
        fats: 1.0,
        isLocal: true,
      },
      {
        id: 'moi_moi',
        name: 'Moi Moi',
        quantity: '1 wrap',
        calories: 230,
        protein: 12.8,
        carbs: 20.5,
        fats: 10.2,
        isLocal: true,
      },
    ],
    instructions: '1. Prepare smooth akamu with milk\n2. Steam moi moi with fish and vegetables\n3. Serve warm together\n4. Traditional and nutritious Nigerian breakfast',
    prepTimeMinutes: 45,
    servings: 1,
  },
  
  // Lunch
  {
    name: 'Jollof Rice with Grilled Fish',
    type: 'lunch',
    calories: 520,
    ingredients: [
      {
        id: 'jollof_rice',
        name: 'Jollof Rice',
        quantity: '200g',
        calories: 280,
        protein: 5.8,
        carbs: 58.0,
        fats: 3.2,
        isLocal: true,
      },
      {
        id: 'grilled_fish',
        name: 'Grilled Catfish',
        quantity: '150g',
        calories: 158,
        protein: 28.1,
        carbs: 0,
        fats: 4.4,
        isLocal: true,
      },
      {
        id: 'salad',
        name: 'Garden Salad',
        quantity: '100g',
        calories: 82,
        protein: 1.8,
        carbs: 6.5,
        fats: 5.5,
        isLocal: false,
      },
    ],
    instructions: '1. Prepare jollof rice with tomatoes and spices\n2. Grill catfish with Nigerian spices\n3. Make fresh salad with cucumber and tomatoes\n4. Classic Nigerian power lunch',
    prepTimeMinutes: 60,
    servings: 1,
  },
  
  {
    name: 'Pounded Yam with Egusi Soup',
    type: 'lunch',
    calories: 680,
    ingredients: [
      {
        id: 'pounded_yam',
        name: 'Pounded Yam',
        quantity: '300g',
        calories: 354,
        protein: 4.5,
        carbs: 84.0,
        fats: 0.6,
        isLocal: true,
      },
      {
        id: 'egusi_soup',
        name: 'Egusi Soup with Fish',
        quantity: '250ml',
        calories: 326,
        protein: 18.2,
        carbs: 8.5,
        fats: 24.8,
        isLocal: true,
      },
    ],
    instructions: '1. Pound yam until smooth and stretchy\n2. Prepare egusi soup with stockfish and ugwu leaves\n3. Serve hot together\n4. Traditional Nigerian heavy meal',
    prepTimeMinutes: 90,
    servings: 1,
  },
  
  // Dinner
  {
    name: 'Pepper Soup with Yam',
    type: 'dinner',
    calories: 450,
    ingredients: [
      {
        id: 'catfish_pepper_soup',
        name: 'Catfish Pepper Soup',
        quantity: '300ml',
        calories: 180,
        protein: 22.5,
        carbs: 5.2,
        fats: 7.8,
        isLocal: true,
      },
      {
        id: 'boiled_yam',
        name: 'Boiled Yam',
        quantity: '200g',
        calories: 270,
        protein: 3.8,
        carbs: 63.0,
        fats: 0.4,
        isLocal: true,
      },
    ],
    instructions: '1. Prepare spicy catfish pepper soup with uziza\n2. Boil yam until tender\n3. Serve hot pepper soup with yam\n4. Perfect Nigerian comfort dinner',
    prepTimeMinutes: 45,
    servings: 1,
  },
  
  // Snacks
  {
    name: 'Tiger Nut Smoothie',
    type: 'snack',
    calories: 280,
    ingredients: [
      {
        id: 'tiger_nuts',
        name: 'Tiger Nuts',
        quantity: '50g',
        calories: 193,
        protein: 2.1,
        carbs: 24.6,
        fats: 9.2,
        isLocal: true,
      },
      {
        id: 'dates',
        name: 'Dates',
        quantity: '30g',
        calories: 87,
        protein: 0.6,
        carbs: 22.5,
        fats: 0.1,
        isLocal: false,
      },
    ],
    instructions: '1. Soak tiger nuts overnight\n2. Blend with dates and little water\n3. Strain and serve chilled\n4. Healthy Nigerian energy drink',
    prepTimeMinutes: 15,
    servings: 1,
  },
];

// Nigerian Diet Plans for seeding
export const nigerianDietPlans = [
  {
    goal: 'lose_belly_fat' as const,
    name: 'Nigerian Fat Loss Plan',
    dailyCaloriesRange: {
      min: 1400,
      max: 1800,
    },
    macroSplit: {
      protein: 30,
      carbs: 35,
      fats: 35,
    },
    mealTemplates: [], // Will be populated during seeding with actual IDs
    localFoodItems: [], // Will be populated during seeding with actual IDs
    mealTypes: ['nigerian_breakfast', 'jollof_fish', 'pepper_soup', 'tiger_nut_smoothie'], // Reference for seeding
    foodCategories: ['protein', 'vegetables', 'high_fiber_carbs'], // Reference for seeding
    description: 'Lose weight the Nigerian way! This plan focuses on traditional foods that are naturally low in calories but high in nutrients. Features pepper soup, grilled fish, and plenty of vegetables.',
  },
  
  {
    goal: 'build_muscle' as const,
    name: 'Nigerian Muscle Building Plan',
    dailyCaloriesRange: {
      min: 2200,
      max: 2800,
    },
    macroSplit: {
      protein: 35,
      carbs: 40,
      fats: 25,
    },
    mealTemplates: [], // Will be populated during seeding
    localFoodItems: [], // Will be populated during seeding
    mealTypes: ['akamu_moimoi', 'pounded_yam_egusi', 'pepper_soup', 'tiger_nut_smoothie'], // Reference for seeding
    foodCategories: ['protein', 'high_protein_foods'], // Reference for seeding
    description: 'Build muscle with traditional Nigerian strength foods! High-protein meals featuring stockfish, catfish, and traditional carbs like pounded yam for energy and growth.',
  },
  
  {
    goal: 'improve_cardio' as const,
    name: 'Nigerian Endurance Plan',
    dailyCaloriesRange: {
      min: 1800,
      max: 2200,
    },
    macroSplit: {
      protein: 25,
      carbs: 50,
      fats: 25,
    },
    mealTemplates: [], // Will be populated during seeding
    localFoodItems: [], // Will be populated during seeding
    mealTypes: ['nigerian_breakfast', 'jollof_fish', 'pepper_soup'], // Reference for seeding
    foodCategories: ['carbs', 'fruits'], // Reference for seeding
    description: 'Fuel your cardio workouts with Nigerian foods! Balanced plan with healthy carbs from yam and plantain, plus antioxidant-rich local fruits for recovery.',
  },
];