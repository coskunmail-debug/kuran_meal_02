import { Stack, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, MEAL_COLORS } from '@/constants/colors';
import { MEAL_DISPLAY_NAMES } from '@/constants/mealNames';
import { SURAHS } from '@/constants/surahs';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="surah/[id]"
          options={({ route }) => {
            const { id } = route.params as { id: string; selectedMeal: string }; // selectedMeal artık başlıkta kullanılmıyor
            const surah = SURAHS.find((s) => s.id === Number(id));
            // const mealAccentColor = MEAL_COLORS[selectedMeal] || COLORS.primary; // Artık kullanılmıyor
            // const displayMealName = MEAL_DISPLAY_NAMES[selectedMeal] || selectedMeal; // Artık kullanılmıyor

            return {
              headerShown: true,
              headerStyle: { backgroundColor: COLORS.background },
              headerTintColor: COLORS.text,
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerTransparent: false,
              headerBlurEffect: 'dark',
              headerLeft: () => (
                <Pressable
                  onPress={() => router.replace('/')}
                  style={{ marginLeft: 10, padding: 5 }}
                >
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 18,
                      fontFamily: 'Inter_600SemiBold',
                      color: COLORS.text,
                      // marginRight: 8, // Tek metin olduğu için artık sağ boşluğa gerek yok
                    }}
                  >
                    {surah ? `${surah.id}. ${surah.name} Suresi` : 'Sure'}
                  </Text>
                  {/* Meal yazarının adı kaldırıldı */}
                </View>
              ),
            };
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
