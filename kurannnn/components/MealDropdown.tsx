import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
// import { BlurView } from 'expo-blur'; // BlurView kaldırıldı
import { COLORS, MEAL_COLORS } from '@/constants/colors';
import { MEAL_DISPLAY_NAMES } from '@/constants/mealNames';

interface MealDropdownProps {
  selectedMeal: string;
  onSelectMeal: (meal: string) => void;
  isMenuVisible: boolean;
  setIsMenuVisible: (visible: boolean) => void;
}

export default function MealDropdown({
  selectedMeal,
  onSelectMeal,
  isMenuVisible,
  setIsMenuVisible,
}: MealDropdownProps) {
  const mealOptions = Object.keys(MEAL_COLORS);
  const currentMealColor = MEAL_COLORS[selectedMeal];
  const displaySelectedMealName = MEAL_DISPLAY_NAMES[selectedMeal] || selectedMeal;

  return (
    <View style={styles.container}>
      <Pressable style={styles.mealDropdown} onPress={() => setIsMenuVisible(!isMenuVisible)}>
        <Text style={[styles.dropdownText, { color: currentMealColor }]}>{displaySelectedMealName}</Text>
        <ChevronDown color={isMenuVisible ? currentMealColor : COLORS.textSecondary} size={16} />
      </Pressable>

      {isMenuVisible && (
        <View // BlurView yerine View kullanıldı
          style={styles.dropdownMenu}
        >
          {mealOptions.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.dropdownItem,
                index !== mealOptions.length - 1 && styles.itemSeparator
              ]}
              onPress={() => onSelectMeal(option)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  option === selectedMeal && { color: currentMealColor, fontFamily: 'Inter_600SemiBold' }
                ]}
              >
                {MEAL_DISPLAY_NAMES[option] || option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  mealDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '110%',
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 220,
    zIndex: 999,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: 'rgba(38, 38, 38, 0.95)', // Opaklık %95 olarak ayarlandı
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
