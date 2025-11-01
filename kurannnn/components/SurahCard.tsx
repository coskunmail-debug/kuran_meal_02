import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Surah } from '@/constants/surahs';

type SurahCardProps = {
  item: Surah;
  mealColor: string;
  selectedMeal: string; // Yeni prop eklendi
};

export default function SurahCard({ item, mealColor, selectedMeal }: SurahCardProps) {
  const handlePress = () => {
    router.push({
      pathname: `/surah/${item.id}`,
      params: { selectedMeal: selectedMeal }, // selectedMeal parametre olarak gönderildi
    });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.leftContent}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{item.id}</Text>
        </View>
        <View>
          <Text style={[styles.surahName, { color: mealColor }]}>{item.name}</Text>
          <Text style={styles.verseCount}>{item.verseCount} Ayet</Text>
        </View>
      </View>
      <ChevronRight color={COLORS.textSecondary} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numberText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  surahName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    // color dinamik olarak mealColor prop'undan geliyor
  },
  verseCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
});
