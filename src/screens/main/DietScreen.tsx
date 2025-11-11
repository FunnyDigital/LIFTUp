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
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealPlan {
  type: string;
  emoji: string;
  items: MealItem[];
}

const DietScreen: React.FC = () => {
  const theme = useTheme();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<string>('breakfast');
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [macros, setMacros] = useState({ protein: 30, carbs: 40, fats: 30 });

  useEffect(() => {
    // Calculate personalized diet plan based on user's goals
    if (userProfile) {
      const goal = userProfile.fitnessGoal;
      let baseCalories = 2000;
      let proteinPercent = 30;
      let carbsPercent = 40;
      let fatsPercent = 30;

      // Adjust based on fitness goal
      switch (goal) {
        case 'build_muscle':
        case 'build_lean_mass':
          baseCalories = 2500;
          proteinPercent = 35;
          carbsPercent = 45;
          fatsPercent = 20;
          break;
        case 'lose_belly_fat':
          baseCalories = 1800;
          proteinPercent = 40;
          carbsPercent = 30;
          fatsPercent = 30;
          break;
        case 'strength_training':
          baseCalories = 2300;
          proteinPercent = 35;
          carbsPercent = 40;
          fatsPercent = 25;
          break;
        case 'improve_cardio':
          baseCalories = 2200;
          proteinPercent = 25;
          carbsPercent = 50;
          fatsPercent = 25;
          break;
        default:
          baseCalories = 2000;
      }

      setDailyCalories(baseCalories);
      setMacros({ protein: proteinPercent, carbs: carbsPercent, fats: fatsPercent });
    }
    
    setTimeout(() => setLoading(false), 500);
  }, [userProfile]);

  const mealPlans: MealPlan[] = [
    {
      type: 'breakfast',
      emoji: '🌅',
      items: [
        { name: 'Yam', localName: 'Ji', calories: 300, protein: 5, carbs: 70, fats: 0.5 },
        { name: 'Eggs (2)', calories: 140, protein: 12, carbs: 1, fats: 10 },
        { name: 'Akara', localName: 'Bean Cakes', calories: 180, protein: 8, carbs: 15, fats: 10 },
        { name: 'Pap', localName: 'Ogi', calories: 120, protein: 2, carbs: 26, fats: 1 },
      ]
    },
    {
      type: 'lunch',
      emoji: '☀️',
      items: [
        { name: 'Jollof Rice', calories: 400, protein: 8, carbs: 75, fats: 8 },
        { name: 'Grilled Chicken', calories: 250, protein: 45, carbs: 0, fats: 7 },
        { name: 'Plantain', localName: 'Dodo', calories: 180, protein: 2, carbs: 40, fats: 1 },
        { name: 'Vegetable Salad', calories: 80, protein: 2, carbs: 10, fats: 3 },
      ]
    },
    {
      type: 'dinner',
      emoji: '🌙',
      items: [
        { name: 'Egusi Soup', calories: 350, protein: 15, carbs: 10, fats: 28 },
        { name: 'Eba', localName: 'Garri', calories: 330, protein: 1, carbs: 80, fats: 0.5 },
        { name: 'Fish (Tilapia)', calories: 200, protein: 40, carbs: 0, fats: 4 },
        { name: 'Vegetables', calories: 50, protein: 2, carbs: 8, fats: 1 },
      ]
    },
    {
      type: 'snacks',
      emoji: '🍎',
      items: [
        { name: 'Groundnuts', localName: 'Epa', calories: 160, protein: 7, carbs: 6, fats: 14 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0.4 },
        { name: 'Chin Chin', calories: 140, protein: 2, carbs: 20, fats: 6 },
        { name: 'Tiger Nut Milk', localName: 'Kunu Aya', calories: 120, protein: 1, carbs: 25, fats: 3 },
      ]
    }
  ];

  const currentMeal = mealPlans.find(meal => meal.type === selectedMeal);
  const totalMealCalories = currentMeal?.items.reduce((sum, item) => sum + item.calories, 0) || 0;
  const totalProtein = currentMeal?.items.reduce((sum, item) => sum + item.protein, 0) || 0;
  const totalCarbs = currentMeal?.items.reduce((sum, item) => sum + item.carbs, 0) || 0;
  const totalFats = currentMeal?.items.reduce((sum, item) => sum + item.fats, 0) || 0;

  if (loading) {
    return (
      <Screen>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.white }]}>
          <ActivityIndicator size="large" color={theme.colors.black} />
          <Text style={[styles.loadingText, { color: theme.colors.gray600 }]}>
            Loading your diet plan...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.white }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Your Diet Plan
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.gray600 }]}>
            Nigerian-inspired meals for {userProfile?.fitnessGoal?.replace(/_/g, ' ')}
          </Text>
        </View>

        {/* Daily Target */}
        <View style={[styles.targetCard, { 
          backgroundColor: theme.colors.black, 
          borderColor: theme.colors.gray800 
        }]}>
          <Text style={[styles.targetTitle, { color: theme.colors.white }]}>
            Daily Target
          </Text>
          <View style={styles.targetRow}>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, { color: theme.colors.white }]}>
                {dailyCalories}
              </Text>
              <Text style={[styles.targetLabel, { color: theme.colors.gray400 }]}>
                Calories
              </Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, { color: theme.colors.white }]}>
                {macros.protein}%
              </Text>
              <Text style={[styles.targetLabel, { color: theme.colors.gray400 }]}>
                Protein
              </Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, { color: theme.colors.white }]}>
                {macros.carbs}%
              </Text>
              <Text style={[styles.targetLabel, { color: theme.colors.gray400 }]}>
                Carbs
              </Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, { color: theme.colors.white }]}>
                {macros.fats}%
              </Text>
              <Text style={[styles.targetLabel, { color: theme.colors.gray400 }]}>
                Fats
              </Text>
            </View>
          </View>
        </View>

        {/* Meal Tabs */}
        <View style={styles.tabContainer}>
          {mealPlans.map((meal) => (
            <TouchableOpacity
              key={meal.type}
              onPress={() => setSelectedMeal(meal.type)}
              style={[
                styles.tab,
                { borderColor: theme.colors.gray300 },
                selectedMeal === meal.type && { 
                  backgroundColor: theme.colors.black,
                  borderColor: theme.colors.black
                }
              ]}
            >
              <Text style={styles.tabEmoji}>{meal.emoji}</Text>
              <Text style={[
                styles.tabText,
                { color: theme.colors.gray600 },
                selectedMeal === meal.type && { color: theme.colors.white }
              ]}>
                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Items */}
        <View style={styles.mealSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
            {currentMeal?.emoji} {currentMeal?.type.charAt(0).toUpperCase()}{currentMeal?.type.slice(1)} Options
          </Text>
          
          {currentMeal?.items.map((item, index) => (
            <View 
              key={index}
              style={[styles.foodCard, { 
                backgroundColor: theme.colors.white,
                borderColor: theme.colors.gray200
              }]}
            >
              <View style={styles.foodHeader}>
                <View>
                  <Text style={[styles.foodName, { color: theme.colors.black }]}>
                    {item.name}
                  </Text>
                  {item.localName && (
                    <Text style={[styles.foodLocalName, { color: theme.colors.gray500 }]}>
                      ({item.localName})
                    </Text>
                  )}
                </View>
                <Text style={[styles.foodCalories, { color: theme.colors.black }]}>
                  {item.calories} cal
                </Text>
              </View>
              
              <View style={styles.macroRow}>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.colors.gray700 }]}>
                    {item.protein}g
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.colors.gray500 }]}>
                    Protein
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.colors.gray700 }]}>
                    {item.carbs}g
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.colors.gray500 }]}>
                    Carbs
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: theme.colors.gray700 }]}>
                    {item.fats}g
                  </Text>
                  <Text style={[styles.macroLabel, { color: theme.colors.gray500 }]}>
                    Fats
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Meal Total */}
          <View style={[styles.totalCard, { 
            backgroundColor: theme.colors.gray100,
            borderColor: theme.colors.gray300
          }]}>
            <Text style={[styles.totalTitle, { color: theme.colors.black }]}>
              Total for this meal
            </Text>
            <View style={styles.totalRow}>
              <Text style={[styles.totalCalories, { color: theme.colors.black }]}>
                {totalMealCalories} calories
              </Text>
              <Text style={[styles.totalMacros, { color: theme.colors.gray600 }]}>
                P: {totalProtein}g • C: {totalCarbs}g • F: {totalFats}g
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={[styles.tipsCard, { 
          backgroundColor: theme.colors.black,
          borderColor: theme.colors.gray800
        }]}>
          <Text style={[styles.tipsTitle, { color: theme.colors.white }]}>
            💡 Diet Tips
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray300 }]}>
            • Drink at least 2-3 liters of water daily
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray300 }]}>
            • Eat local, fresh foods when available
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray300 }]}>
            • Space meals 3-4 hours apart
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.gray300 }]}>
            • Adjust portions based on hunger and activity
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  targetCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  targetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetItem: {
    alignItems: 'center',
  },
  targetValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mealSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  foodCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
  },
  foodLocalName: {
    fontSize: 13,
    marginTop: 2,
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: '700',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  macroLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  totalCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  totalTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  totalRow: {
    gap: 4,
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalMacros: {
    fontSize: 13,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  },
});

export default DietScreen;
