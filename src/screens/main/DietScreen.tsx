import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import Screen from '@/components/ui/Screen';
import { useTheme } from '@/constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface MealItem {
  name: string;
  localName?: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner';
  time: string;
  items: MealItem[];
}

interface DailyMealPlan {
  day: string;
  date: Date;
  meals: Meal[];
  waterReminder: string;
  totalCalories: number;
}

const DietScreen: React.FC = () => {
  const theme = useTheme();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<DailyMealPlan[]>([]);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate Nigerian meal plans based on user's goal
  const generateMealPlan = (dayIndex: number, goal: string): DailyMealPlan => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayIndex);

    let breakfast: Omit<Meal, 'type'>;
    let lunch: Omit<Meal, 'type'>;
    let dinner: Omit<Meal, 'type'>;
    let calorieTarget = 2000;

    // Adjust calories and meals based on fitness goal
    if (goal === 'lose_belly_fat') {
      calorieTarget = 1800;
      
      const breakfastOptions = [
        {
          time: '7:00 AM',
          items: [
            { name: 'Oatmeal with Banana', localName: 'Oats & Ogede', portion: '1 cup', calories: 200, protein: 6, carbs: 40, fats: 3 },
            { name: 'Boiled Eggs', portion: '2 eggs', calories: 140, protein: 12, carbs: 1, fats: 10 },
            { name: 'Green Tea', portion: '1 cup', calories: 2, protein: 0, carbs: 0, fats: 0 },
          ]
        },
        {
          time: '7:00 AM',
          items: [
            { name: 'Moi Moi', localName: 'Bean Pudding', portion: '2 wraps', calories: 220, protein: 15, carbs: 25, fats: 6 },
            { name: 'Agidi', localName: 'Corn Jelly', portion: '1 medium', calories: 120, protein: 2, carbs: 28, fats: 0.5 },
            { name: 'Cucumber Salad', portion: '1 cup', calories: 16, protein: 1, carbs: 4, fats: 0 },
          ]
        },
      ];

      const lunchOptions = [
        {
          time: '1:00 PM',
          items: [
            { name: 'Grilled Fish', localName: 'Eja Dindin', portion: '150g', calories: 180, protein: 35, carbs: 0, fats: 4 },
            { name: 'Garden Egg Stew', localName: 'Igba Stew', portion: '1 cup', calories: 120, protein: 3, carbs: 15, fats: 6 },
            { name: 'Boiled Plantain', localName: 'Ogede Sisun', portion: '1 medium', calories: 180, protein: 2, carbs: 40, fats: 1 },
            { name: 'Mixed Vegetables', portion: '1 cup', calories: 50, protein: 2, carbs: 10, fats: 0.5 },
          ]
        },
        {
          time: '1:00 PM',
          items: [
            { name: 'Ofada Rice', localName: 'Local Rice', portion: '3/4 cup', calories: 250, protein: 5, carbs: 55, fats: 1 },
            { name: 'Ayamase Sauce', localName: 'Designer Stew', portion: '1/2 cup', calories: 180, protein: 12, carbs: 8, fats: 12 },
            { name: 'Grilled Chicken', portion: '100g', calories: 165, protein: 31, carbs: 0, fats: 4 },
            { name: 'Cabbage Salad', portion: '1 cup', calories: 35, protein: 1, carbs: 8, fats: 0 },
          ]
        },
      ];

      const dinnerOptions = [
        {
          time: '7:00 PM',
          items: [
            { name: 'Efo Riro', localName: 'Vegetable Soup', portion: '1.5 cups', calories: 280, protein: 18, carbs: 12, fats: 20 },
            { name: 'Amala', localName: 'Yam Flour', portion: '1 small ball', calories: 180, protein: 2, carbs: 42, fats: 0.5 },
            { name: 'Ponmo', localName: 'Cow Skin', portion: '50g', calories: 45, protein: 8, carbs: 0, fats: 1 },
          ]
        },
        {
          time: '7:00 PM',
          items: [
            { name: 'Pepper Soup', localName: 'Obe Ata', portion: '2 cups', calories: 200, protein: 25, carbs: 8, fats: 8 },
            { name: 'Unripe Plantain', localName: 'Ogede Wewe', portion: '1 medium', calories: 160, protein: 2, carbs: 38, fats: 0.5 },
            { name: 'Fish', portion: '100g', calories: 120, protein: 24, carbs: 0, fats: 2 },
          ]
        },
      ];

      breakfast = breakfastOptions[dayIndex % breakfastOptions.length];
      lunch = lunchOptions[dayIndex % lunchOptions.length];
      dinner = dinnerOptions[dayIndex % dinnerOptions.length];

    } else if (goal === 'build_muscle' || goal === 'build_lean_mass') {
      calorieTarget = 2500;

      const breakfastOptions = [
        {
          time: '7:00 AM',
          items: [
            { name: 'Yam Porridge', localName: 'Asaro', portion: '2 cups', calories: 380, protein: 8, carbs: 75, fats: 6 },
            { name: 'Scrambled Eggs', portion: '3 eggs', calories: 210, protein: 18, carbs: 2, fats: 15 },
            { name: 'Akara', localName: 'Bean Cakes', portion: '4 pieces', calories: 240, protein: 12, carbs: 20, fats: 14 },
            { name: 'Pap', localName: 'Ogi', portion: '1 cup', calories: 120, protein: 2, carbs: 26, fats: 1 },
          ]
        },
        {
          time: '7:00 AM',
          items: [
            { name: 'Wheat Bread', portion: '3 slices', calories: 240, protein: 9, carbs: 45, fats: 3 },
            { name: 'Egg & Sardine Sauce', portion: '1 cup', calories: 280, protein: 25, carbs: 6, fats: 18 },
            { name: 'Avocado', localName: 'Pear', portion: '1/2 fruit', calories: 120, protein: 1, carbs: 6, fats: 11 },
            { name: 'Banana', portion: '1 large', calories: 121, protein: 1, carbs: 31, fats: 0.4 },
          ]
        },
      ];

      const lunchOptions = [
        {
          time: '1:00 PM',
          items: [
            { name: 'Jollof Rice', portion: '2 cups', calories: 500, protein: 10, carbs: 95, fats: 10 },
            { name: 'Grilled Chicken', portion: '200g', calories: 330, protein: 62, carbs: 0, fats: 8 },
            { name: 'Fried Plantain', localName: 'Dodo', portion: '1 large', calories: 220, protein: 2, carbs: 48, fats: 3 },
            { name: 'Coleslaw', portion: '1 cup', calories: 150, protein: 1, carbs: 12, fats: 12 },
          ]
        },
        {
          time: '1:00 PM',
          items: [
            { name: 'Pounded Yam', localName: 'Iyan', portion: '1 large ball', calories: 400, protein: 5, carbs: 95, fats: 0.5 },
            { name: 'Egusi Soup', portion: '2 cups', calories: 450, protein: 20, carbs: 15, fats: 35 },
            { name: 'Goat Meat', localName: 'Ew ọn', portion: '150g', calories: 200, protein: 28, carbs: 0, fats: 10 },
            { name: 'Stockfish', localName: 'Panla', portion: '50g', calories: 80, protein: 16, carbs: 0, fats: 1 },
          ]
        },
      ];

      const dinnerOptions = [
        {
          time: '7:30 PM',
          items: [
            { name: 'Fried Rice', portion: '2 cups', calories: 450, protein: 12, carbs: 75, fats: 12 },
            { name: 'Beef Stew', portion: '1 cup', calories: 280, protein: 25, carbs: 10, fats: 18 },
            { name: 'Turkey', portion: '150g', calories: 180, protein: 36, carbs: 0, fats: 4 },
            { name: 'Moin Moin', portion: '1 wrap', calories: 120, protein: 8, carbs: 12, fats: 4 },
          ]
        },
        {
          time: '7:30 PM',
          items: [
            { name: 'Coconut Rice', portion: '2 cups', calories: 480, protein: 8, carbs: 80, fats: 16 },
            { name: 'Chicken Stew', portion: '1 cup', calories: 250, protein: 22, carbs: 12, fats: 14 },
            { name: 'Gizdodo', localName: 'Gizzard & Plantain', portion: '1 cup', calories: 320, protein: 18, carbs: 35, fats: 12 },
          ]
        },
      ];

      breakfast = breakfastOptions[dayIndex % breakfastOptions.length];
      lunch = lunchOptions[dayIndex % lunchOptions.length];
      dinner = dinnerOptions[dayIndex % dinnerOptions.length];

    } else if (goal === 'strength_training') {
      calorieTarget = 2300;

      const breakfastOptions = [
        {
          time: '6:30 AM',
          items: [
            { name: 'Beans Porridge', localName: 'Ewa Oloyin', portion: '2 cups', calories: 360, protein: 24, carbs: 60, fats: 4 },
            { name: 'Fried Plantain', localName: 'Dodo', portion: '1 medium', calories: 180, protein: 2, carbs: 40, fats: 2 },
            { name: 'Egg Omelette', portion: '2 eggs', calories: 180, protein: 14, carbs: 2, fats: 14 },
          ]
        },
        {
          time: '6:30 AM',
          items: [
            { name: 'Custard', localName: 'Custard Powder', portion: '1.5 cups', calories: 220, protein: 4, carbs: 50, fats: 2 },
            { name: 'Groundnut', localName: 'Epa', portion: '1/2 cup', calories: 320, protein: 14, carbs: 12, fats: 28 },
            { name: 'Banana', portion: '2 medium', calories: 210, protein: 2, carbs: 54, fats: 1 },
          ]
        },
      ];

      const lunchOptions = [
        {
          time: '1:00 PM',
          items: [
            { name: 'White Rice', portion: '1.5 cups', calories: 300, protein: 6, carbs: 68, fats: 0.5 },
            { name: 'Banga Soup', localName: 'Ofe Akwu', portion: '1.5 cups', calories: 380, protein: 20, carbs: 10, fats: 30 },
            { name: 'Assorted Meat', portion: '150g', calories: 250, protein: 30, carbs: 0, fats: 14 },
            { name: 'Ugu Vegetables', portion: '1 cup', calories: 30, protein: 3, carbs: 5, fats: 0 },
          ]
        },
        {
          time: '1:00 PM',
          items: [
            { name: 'Tuwo Shinkafa', localName: 'Rice Fufu', portion: '1 large ball', calories: 380, protein: 6, carbs: 85, fats: 1 },
            { name: 'Miyan Kuka', localName: 'Baobab Soup', portion: '1.5 cups', calories: 280, protein: 25, carbs: 12, fats: 16 },
            { name: 'Beef', portion: '120g', calories: 220, protein: 28, carbs: 0, fats: 12 },
          ]
        },
      ];

      const dinnerOptions = [
        {
          time: '7:00 PM',
          items: [
            { name: 'Semovita', localName: 'Semo', portion: '1 medium ball', calories: 320, protein: 4, carbs: 75, fats: 0.5 },
            { name: 'Okro Soup', localName: 'Obe Ila', portion: '1.5 cups', calories: 250, protein: 18, carbs: 15, fats: 16 },
            { name: 'Catfish', localName: 'Eja', portion: '150g', calories: 180, protein: 32, carbs: 0, fats: 6 },
          ]
        },
        {
          time: '7:00 PM',
          items: [
            { name: 'Eba', localName: 'Garri', portion: '1 medium ball', calories: 330, protein: 1, carbs: 80, fats: 0.5 },
            { name: 'Edikang Ikong', localName: 'Vegetable Soup', portion: '2 cups', calories: 400, protein: 22, carbs: 18, fats: 28 },
            { name: 'Dried Fish', localName: 'Eja Gbigbe', portion: '80g', calories: 160, protein: 30, carbs: 0, fats: 4 },
          ]
        },
      ];

      breakfast = breakfastOptions[dayIndex % breakfastOptions.length];
      lunch = lunchOptions[dayIndex % lunchOptions.length];
      dinner = dinnerOptions[dayIndex % dinnerOptions.length];

    } else {
      // Default/Cardio goal
      calorieTarget = 2000;

      const breakfastOptions = [
        {
          time: '7:00 AM',
          items: [
            { name: 'Oats & Honey', portion: '1 cup', calories: 220, protein: 6, carbs: 42, fats: 4 },
            { name: 'Boiled Eggs', portion: '2 eggs', calories: 140, protein: 12, carbs: 1, fats: 10 },
            { name: 'Paw Paw', localName: 'Pawpaw', portion: '1 cup', calories: 55, protein: 1, carbs: 14, fats: 0 },
          ]
        },
        {
          time: '7:00 AM',
          items: [
            { name: 'Bread & Akara', portion: '2 slices + 3 akara', calories: 340, protein: 12, carbs: 45, fats: 13 },
            { name: 'Kunu', localName: 'Millet Drink', portion: '1 cup', calories: 140, protein: 3, carbs: 30, fats: 1 },
            { name: 'Orange', portion: '1 medium', calories: 62, protein: 1, carbs: 15, fats: 0 },
          ]
        },
      ];

      const lunchOptions = [
        {
          time: '1:00 PM',
          items: [
            { name: 'Jollof Rice', portion: '1.5 cups', calories: 375, protein: 7, carbs: 71, fats: 7 },
            { name: 'Grilled Chicken', portion: '150g', calories: 248, protein: 47, carbs: 0, fats: 6 },
            { name: 'Plantain', localName: 'Dodo', portion: '1 medium', calories: 180, protein: 2, carbs: 40, fats: 1 },
            { name: 'Garden Salad', portion: '1 cup', calories: 70, protein: 2, carbs: 12, fats: 2 },
          ]
        },
        {
          time: '1:00 PM',
          items: [
            { name: 'Spaghetti', portion: '1.5 cups', calories: 300, protein: 10, carbs: 60, fats: 2 },
            { name: 'Tomato Stew', portion: '1 cup', calories: 150, protein: 8, carbs: 15, fats: 8 },
            { name: 'Turkey', portion: '120g', calories: 144, protein: 29, carbs: 0, fats: 3 },
            { name: 'Cucumber', portion: '1 cup', calories: 16, protein: 1, carbs: 4, fats: 0 },
          ]
        },
      ];

      const dinnerOptions = [
        {
          time: '7:00 PM',
          items: [
            { name: 'Wheat Swallow', localName: 'Amala Wheat', portion: '1 small ball', calories: 200, protein: 4, carbs: 45, fats: 1 },
            { name: 'Vegetable Soup', portion: '1.5 cups', calories: 220, protein: 15, carbs: 12, fats: 14 },
            { name: 'Fish & Ponmo', portion: '100g', calories: 130, protein: 22, carbs: 0, fats: 4 },
          ]
        },
        {
          time: '7:00 PM',
          items: [
            { name: 'Boiled Yam', localName: 'Isu Sisun', portion: '2 medium', calories: 280, protein: 4, carbs: 65, fats: 0.5 },
            { name: 'Egg Sauce', portion: '1 cup', calories: 200, protein: 14, carbs: 8, fats: 14 },
            { name: 'Fried Fish', portion: '100g', calories: 150, protein: 22, carbs: 0, fats: 6 },
          ]
        },
      ];

      breakfast = breakfastOptions[dayIndex % breakfastOptions.length];
      lunch = lunchOptions[dayIndex % lunchOptions.length];
      dinner = dinnerOptions[dayIndex % dinnerOptions.length];
    }

    const totalCalories = 
      breakfast.items.reduce((sum, item) => sum + item.calories, 0) +
      lunch.items.reduce((sum, item) => sum + item.calories, 0) +
      dinner.items.reduce((sum, item) => sum + item.calories, 0);

    return {
      day: daysOfWeek[targetDate.getDay()],
      date: targetDate,
      meals: [
        { type: 'breakfast', ...breakfast },
        { type: 'lunch', ...lunch },
        { type: 'dinner', ...dinner },
      ],
      waterReminder: `Drink ${Math.ceil(calorieTarget / 500)} liters of water today (about ${Math.ceil(calorieTarget / 500) * 4} glasses)`,
      totalCalories,
    };
  };

  useEffect(() => {
    if (userProfile) {
      const goal = userProfile.fitnessGoal || 'improve_cardio';
      
      // Generate 7 days of meal plans
      const plans: DailyMealPlan[] = [];
      for (let i = 0; i < 7; i++) {
        plans.push(generateMealPlan(i, goal));
      }
      
      setWeeklyMealPlan(plans);
      
      // Set calorie target based on goal
      let target = 2000;
      if (goal === 'lose_belly_fat') target = 1800;
      else if (goal === 'build_muscle' || goal === 'build_lean_mass') target = 2500;
      else if (goal === 'strength_training') target = 2300;
      
      setDailyCalorieTarget(target);
    }
    
    setTimeout(() => setLoading(false), 500);
  }, [userProfile]);

  const currentDayPlan = weeklyMealPlan[selectedDayIndex];

  if (loading || !currentDayPlan) {
    return (
      <Screen>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.black }]}>
          <ActivityIndicator size="large" color={theme.colors.white} />
          <Text style={[styles.loadingText, { color: theme.colors.gray400 }]}>
            Preparing your meal plan...
          </Text>
        </View>
      </Screen>
    );
  }

  const getTodayIndex = () => {
    return new Date().getDay();
  };

  return (
    <Screen>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            Your Diet Plan
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray400 }]}>
            {userProfile?.fitnessGoal?.replace(/_/g, ' ').charAt(0).toUpperCase() + userProfile?.fitnessGoal?.replace(/_/g, ' ').slice(1)} • {dailyCalorieTarget} cal/day
          </Text>
        </View>

        {/* Week Day Selector */}
        <View style={styles.weekContainer}>
          <View style={styles.daysRow}>
            {daysShort.map((day, index) => {
              const isSelected = selectedDayIndex === index;
              const isToday = getTodayIndex() === index;
              
              return (
                <TouchableOpacity
                  key={`${day}-${index}`}
                  style={[
                    styles.dayButton,
                    isSelected
                      ? { backgroundColor: theme.colors.white, borderColor: theme.colors.white }
                      : { backgroundColor: 'transparent', borderColor: theme.colors.gray500 }
                  ]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <Text style={[
                    styles.dayText,
                    { color: isSelected ? theme.colors.black : theme.colors.gray400 }
                  ]}>
                    {day}
                  </Text>
                  {isToday && !isSelected && (
                    <View style={[styles.todayDot, { backgroundColor: theme.colors.white }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.selectedDayLabel, { color: theme.colors.gray400 }]}>
            {currentDayPlan.day}'s Meal Plan
          </Text>
        </View>

        {/* Daily Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.gray800 }]}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.colors.gray400 }]}>
                Total Calories
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.white }]}>
                {currentDayPlan.totalCalories} cal
              </Text>
            </View>
            <View style={[styles.summaryBadge, { backgroundColor: theme.colors.black }]}>
              <Text style={[styles.badgeText, { color: theme.colors.white }]}>
                {currentDayPlan.meals.length} Meals
              </Text>
            </View>
          </View>
        </View>

        {/* Water Reminder */}
        <View style={[styles.waterCard, { backgroundColor: theme.colors.gray900, borderColor: theme.colors.gray700 }]}>
          <Text style={styles.waterEmoji}>💧</Text>
          <View style={styles.waterContent}>
            <Text style={[styles.waterTitle, { color: theme.colors.white }]}>
              Water Reminder
            </Text>
            <Text style={[styles.waterText, { color: theme.colors.gray400 }]}>
              {currentDayPlan.waterReminder}
            </Text>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.mealsContainer}>
          {currentDayPlan.meals.map((meal, mealIndex) => {
            const mealEmoji = meal.type === 'breakfast' ? '🌅' : meal.type === 'lunch' ? '☀️' : '🌙';
            const totalMealCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
            
            return (
              <View key={mealIndex} style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealTitleRow}>
                    <Text style={styles.mealEmoji}>{mealEmoji}</Text>
                    <View>
                      <Text style={[styles.mealTitle, { color: theme.colors.white }]}>
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </Text>
                      <Text style={[styles.mealTime, { color: theme.colors.gray400 }]}>
                        {meal.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.mealCalories, { color: theme.colors.white }]}>
                    {totalMealCalories} cal
                  </Text>
                </View>

                {/* Meal Items */}
                {meal.items.map((item, itemIndex) => (
                  <View 
                    key={itemIndex}
                    style={[styles.foodCard, { backgroundColor: theme.colors.gray800 }]}
                  >
                    <View style={styles.foodHeader}>
                      <View style={styles.foodInfo}>
                        <Text style={[styles.foodName, { color: theme.colors.white }]}>
                          {item.name}
                        </Text>
                        {item.localName && (
                          <Text style={[styles.foodLocalName, { color: theme.colors.gray400 }]}>
                            ({item.localName})
                          </Text>
                        )}
                        <Text style={[styles.foodPortion, { color: theme.colors.gray500 }]}>
                          {item.portion}
                        </Text>
                      </View>
                      <Text style={[styles.foodCalories, { color: theme.colors.white }]}>
                        {item.calories}
                      </Text>
                    </View>
                    
                    <View style={styles.macroRow}>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroLabel, { color: theme.colors.gray500 }]}>
                          Protein
                        </Text>
                        <Text style={[styles.macroValue, { color: theme.colors.gray300 }]}>
                          {item.protein}g
                        </Text>
                      </View>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroLabel, { color: theme.colors.gray500 }]}>
                          Carbs
                        </Text>
                        <Text style={[styles.macroValue, { color: theme.colors.gray300 }]}>
                          {item.carbs}g
                        </Text>
                      </View>
                      <View style={styles.macroItem}>
                        <Text style={[styles.macroLabel, { color: theme.colors.gray500 }]}>
                          Fats
                        </Text>
                        <Text style={[styles.macroValue, { color: theme.colors.gray300 }]}>
                          {item.fats}g
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: theme.colors.gray900, borderColor: theme.colors.gray700 }]}>
          <Text style={[styles.tipsTitle, { color: theme.colors.white }]}>
            💡 Nigerian Diet Tips
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray400 }]}>
            • Buy fresh ingredients from local markets for best quality
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray400 }]}>
            • Prepare meals in advance to save time and money
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray400 }]}>
            • Adjust portions based on your hunger and activity level
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray400 }]}>
            • Stay hydrated throughout the day, especially in hot weather
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  weekContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  },
  selectedDayLabel: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  summaryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  waterCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  waterContent: {
    flex: 1,
  },
  waterTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  waterText: {
    fontSize: 13,
    lineHeight: 18,
  },
  mealsContainer: {
    paddingHorizontal: 16,
  },
  mealSection: {
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  mealTime: {
    fontSize: 13,
    marginTop: 2,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '700',
  },
  foodCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  foodLocalName: {
    fontSize: 12,
    marginBottom: 2,
  },
  foodPortion: {
    fontSize: 12,
    marginTop: 2,
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  tipsCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});

export default DietScreen;
