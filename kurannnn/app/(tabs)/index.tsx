import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MEALS = {
  'Diyanet İşleri': 'diyanet',
  'Süleyman Ateş': 'suleymanates',
  'Elmalılı Hamdi Yazır': 'elmalilihamdiyazir',
  'Bayraktar Bayraklı': 'bayraktarbayrakli',
  'Elmalılı (sadeleştirilmiş)': 'elmalilisadelestirilmis',
  'Mehmet Okuyan': 'mehmetokuyan',
  'Mustafa İslamoğlu': 'mustafaislamoglu',
  'Muhammed Esed': 'muhammedesed',
  'Süleymaniye Vakfı': 'suleymaniyevakfi',
  'İbni Kesir': 'ibnikesir',
  'Gültekin Onan': 'gultekinonan',
};

const MEAL_COLORS = {
  'Diyanet İşleri': '#8B5CF6',
  'Süleyman Ateş': '#EC4899',
  'Elmalılı Hamdi Yazır': '#F59E0B',
  'Bayraktar Bayraklı': '#10B981',
  'Elmalılı (sadeleştirilmiş)': '#3B82F6',
  'Mehmet Okuyan': '#6366F1',
  'Mustafa İslamoğlu': '#D946EF',
  'Muhammed Esed': '#F43F5E',
  'Süleymaniye Vakfı': '#14B8A6',
  'İbni Kesir': '#A855F7',
  'Gültekin Onan': '#84CC16',
};

type MealKey = keyof typeof MEALS;

const { width, height } = Dimensions.get('window');

const SurahListItem = ({ item, selectedMeal }: { item: any; selectedMeal: MealKey }) => (
  <Link href={`/surah/${item.id}?author=${MEALS[selectedMeal]}&mealName=${selectedMeal}`} asChild>
    <TouchableOpacity style={styles.surahButton}>
      <View style={styles.surahNumberContainer}>
        <Text style={styles.surahNumber}>{item.id}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name_simple} Suresi</Text>
        <Text style={styles.surahMeta}>
          {item.revelation_place === 'makkah' ? 'Mekke' : 'Medine'} • {item.verses_count} Ayet
        </Text>
      </View>
      <Text style={styles.surahArabicName}>{item.name_arabic}</Text>
    </TouchableOpacity>
  </Link>
);

const MealDropdown = ({ selectedMeal, onSelect, isOpen, setIsOpen }) => {
  const mealColor = MEAL_COLORS[selectedMeal];

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsOpen(!isOpen)}>
        <Text style={[styles.dropdownHeaderText, { color: mealColor }]}>{selectedMeal}</Text>
        <ChevronDown color={mealColor} size={20} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>
      {isOpen && (
        <BlurView
          intensity={90}
          tint="dark"
          style={styles.dropdownListContainer}
          overflow="hidden"
        >
          <FlatList
            data={Object.keys(MEALS) as MealKey[]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedMeal === item && { color: MEAL_COLORS[item] },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </BlurView>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<MealKey>('Diyanet İşleri');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.acikkuran.com/surahs');
        const data = await response.json();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const memoizedRenderItem = useMemo(() => ({ item }) => (
    <SurahListItem item={item} selectedMeal={selectedMeal} />
  ), [selectedMeal]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3F3086', '#171717']}
        style={styles.gradientBackground}
        locations={[0, 0.58]}
      />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Kur'an Meal</Text>
        <MealDropdown
          selectedMeal={selectedMeal}
          onSelect={setSelectedMeal}
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#9E7FFF" style={styles.loader} />
      ) : (
        <FlatList
          data={surahs}
          renderItem={memoizedRenderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 120, paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
    transform: [
      { scaleX: 1.5 },
      { translateY: -height * 0.25 }
    ],
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2F2F2F',
  },
  surahNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(47, 47, 47, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumber: {
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  surahMeta: {
    color: '#A3A3A3',
    fontSize: 14,
    marginTop: 4,
  },
  surahArabicName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'serif', // Amiri is a good font for Arabic
  },
  // Dropdown Styles
  dropdownContainer: {
    position: 'relative',
    zIndex: 20,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(47, 47, 47, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2F2F2F',
  },
  dropdownHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  dropdownListContainer: {
    position: 'absolute',
    top: '110%',
    right: 0,
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: height * 0.6,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemText: {
    color: '#A3A3A3',
    fontSize: 16,
    fontWeight: '500',
  },
});
