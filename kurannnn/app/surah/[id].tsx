import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, MEAL_COLORS } from '@/constants/colors';
import { SURAHS, Ayah } from '@/constants/surahs';
import { ACİK_KURAN_API_BASE_URL, AUTHORS_API_URL, MEAL_API_AUTHORS } from '@/constants/api';
import { MEAL_DISPLAY_NAMES } from '@/constants/mealNames';
import AyahItem from '@/components/AyahItem';
import MealDropdown from '@/components/MealDropdown';
import { BlurView } from 'expo-blur';

export default function SurahDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const initialSurahId = Number(params.id);
  const initialSelectedMealFromParams = params.selectedMeal as string;

  const surah = SURAHS.find((s) => s.id === initialSurahId);

  const [currentSelectedMeal, setCurrentSelectedMeal] = useState(initialSelectedMealFromParams);
  const [isMealMenuVisible, setIsMealMenuVisible] = useState(false);

  const [fetchedAyahs, setFetchedAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authorIdMap, setAuthorIdMap] = useState<{ [name: string]: number }>({});
  const [isAuthorsLoading, setIsAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState<string | null>(null);

  const mealAccentColor = MEAL_COLORS[currentSelectedMeal] || COLORS.primary;

  useEffect(() => {
    const fetchAuthors = async () => {
      console.log("--- Yazar Listesi Çekme İşlemi Başladı ---");
      try {
        const response = await fetch(AUTHORS_API_URL);
        if (!response.ok) {
          throw new Error(`API hatası: ${response.status} ${response.statusText}. Yazar listesi alınamadı.`);
        }
        const data = await response.json();
        console.log("API'den gelen tüm yazarlar:", data.data); // DEBUG: API'den gelen tüm yazarları logla
        const map: { [name: string]: number } = {};
        data.data.forEach((author: any) => {
          map[author.name] = author.id;
        });
        setAuthorIdMap(map);
        console.log("Yazar ID Haritası:", map);
      } catch (err: any) {
        console.error("Yazar listesi çekilirken genel bir hata oluştu:", err);
        setAuthorsError("Mealleri yüklerken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin.");
      } finally {
        setIsAuthorsLoading(false);
        console.log("--- Yazar Listesi Çekme İşlemi Tamamlandı ---");
      }
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    const fetchAyahs = async () => {
      console.log("--- Ayet Çekme İşlemi Başladı ---");
      console.log("Parametreler: id =", initialSurahId, ", currentSelectedMeal =", currentSelectedMeal);

      if (!surah || !currentSelectedMeal) {
        const missingInfo = [];
        if (!surah) missingInfo.push("Sure");
        if (!currentSelectedMeal) missingInfo.push("meal");
        const errorMessage = `${missingInfo.join(" veya ")} bilgisi eksik.`;
        console.error("Hata:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (isAuthorsLoading) {
        console.log("Yazar ID'leri henüz yüklenmedi, bekliyor...");
        return;
      }
      if (authorsError) {
        setError(authorsError);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setFetchedAyahs([]);

      const apiAuthorName = MEAL_API_AUTHORS[currentSelectedMeal];
      console.log("MEAL_API_AUTHORS'tan alınan API Yazar Adı:", apiAuthorName); // DEBUG: API yazar adını logla

      const authorId = authorIdMap[apiAuthorName];
      console.log(`'${currentSelectedMeal}' için bulunan yazar ID'si:`, authorId); // DEBUG: Bulunan yazar ID'sini logla

      if (!authorId) {
        const errorMessage = `'${currentSelectedMeal}' meali için API yazar ID'si bulunamadı. Lütfen constants/api.ts dosyasındaki yazar isimlerini ve API'deki yazar listesini kontrol edin.`;
        console.error("Hata:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = `${ACİK_KURAN_API_BASE_URL}/surah/${surah.id}?author=${authorId}`;
        console.log("API İstek URL'si:", apiUrl); // DEBUG: Oluşturulan API URL'sini logla

        const response = await fetch(apiUrl);
        console.log("API Yanıt Durumu (response.status):", response.status);
        console.log("API Yanıt Başarılı mı (response.ok):", response.ok);

        if (!response.ok) {
          let errorBody = "Detaylı hata mesajı alınamadı.";
          try {
            errorBody = await response.text();
          } catch (e) {
            console.warn("API hata yanıtı metin olarak okunamadı:", e);
          }
          throw new Error(`API hatası: ${response.status} ${response.statusText}. Detay: ${errorBody}`);
        }
        
        const data = await response.json();
        console.log("API Yanıt Verisi (ilk 2 ayet):", data.data.verses ? data.data.verses.slice(0, 2) : data);

        const transformedAyahs: Ayah[] = data.data.verses.map((apiAyah: any) => {
          return {
            ayahId: apiAyah.verse_number,
            arabic: apiAyah.verse,
            meals: {
              [currentSelectedMeal]: apiAyah.translation ? apiAyah.translation.text : "Çeviri bulunamadı.",
            },
            footnotes: apiAyah.translation?.footnotes || [],
          };
        });
        setFetchedAyahs(transformedAyahs);
        console.log("Ayetler başarıyla çekildi ve dönüştürüldü.");
      } catch (err: any) {
        console.error("Ayetler çekilirken genel bir hata oluştu:", err);
        let userErrorMessage = "Ayetler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.";

        if (err instanceof TypeError && err.message === 'Network request failed') {
          userErrorMessage = "İnternet bağlantınızı kontrol edin veya API'ye ulaşılamıyor olabilir.";
        } else if (err.message.includes("API hatası")) {
          userErrorMessage = err.message;
        } else if (err.message.includes("JSON Parse error")) {
          userErrorMessage = "API'den gelen veri okunamadı. Lütfen daha sonra tekrar deneyin.";
        } else if (err.message) {
            userErrorMessage = `Bir hata oluştu: ${err.message}`;
        }
        setError(userErrorMessage);
      } finally {
        setIsLoading(false);
        console.log("--- Ayet Çekme İşlemi Tamamlandı ---");
      }
    };

    if (!isAuthorsLoading && !authorsError) {
      fetchAyahs();
    }
  }, [initialSurahId, currentSelectedMeal, surah, isAuthorsLoading, authorsError, authorIdMap]);

  const handleMealSelect = (meal: string) => {
    setCurrentSelectedMeal(meal);
    setIsMealMenuVisible(false);
    router.setParams({ selectedMeal: meal }); 
  };

  // DEBUG: MealDropdown'a gönderilen prop'ları logla
  console.log('[SurahDetailScreen] MealDropdown Props:', {
    selectedMeal: currentSelectedMeal,
    isMenuVisible: isMealMenuVisible,
  });

  if (isAuthorsLoading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
        <Text style={styles.loadingText}>Mealler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (authorsError) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.errorText}>{authorsError}</Text>
      </SafeAreaView>
    );
  }

  if (!surah) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.errorText}>Sure bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const FIXED_DROPDOWN_AREA_HEIGHT = 16 + 44 + 16;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.fixedMealDropdownContainerWrapper}>
        <BlurView
          intensity={70}
          tint="dark"
          style={styles.fixedMealDropdownBlurBackground}
        >
          <View style={styles.fixedMealDropdownContent}>
            <MealDropdown
              selectedMeal={currentSelectedMeal}
              onSelectMeal={handleMealSelect}
              isMenuVisible={isMealMenuVisible}
              setIsMenuVisible={setIsMealMenuVisible}
            />
          </View>
        </BlurView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: FIXED_DROPDOWN_AREA_HEIGHT }}
        onScroll={() => isMealMenuVisible && setIsMealMenuVisible(false)}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: mealAccentColor }]}>
            {surah.id}. {surah.name} Suresi
          </Text>
          <Text style={styles.headerSubtitle}>{surah.verseCount} ayettir.</Text>
        </View>
        
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : fetchedAyahs.length > 0 ? (
            fetchedAyahs.map((ayah) => (
              <AyahItem 
                key={ayah.ayahId} 
                ayah={ayah} 
                selectedMeal={currentSelectedMeal}
              />
            ))
          ) : (
            <Text style={styles.placeholderText}>
              {surah.name} suresinin ayetleri bulunamadı veya henüz eklenmedi.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fixedMealDropdownContainerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  fixedMealDropdownBlurBackground: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fixedMealDropdownContent: {
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  content: {
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 40,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
