export const COLORS = {
  primary: '#9E7FFF', // Diyanet İşleri
  secondary: '#38bdf8', // Süleyman Ateş
  accent: '#f472b6', // Elmalılı Hamdi Yazır
  background: '#171717',
  surface: '#262626',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  border: '#2F2F2F',
  success: '#10b981', // Bayraktar Bayraklı
  warning: '#f59e0b', // Mehmet Okuyan
  error: '#ef4444', // Hata mesajları için ayrıldı

  // Yeni mealler için ek renkler
  info: '#0ea5e9', // Elmalılı (sadeleştirilmiş) için Sky Blue
  purple: '#a855f7', // Mustafa İslamoğlu için Purple
  emerald: '#059669', // Muhammed Esed için Dark Green
  rose: '#e11d48', // Süleymaniye Vakfı için Rose Red
  amber: '#fbbf24', // İbni Kesir için Amber (warning'den farklı bir ton)
  lime: '#84cc16', // Gültekin Onan için Lime Green
};

export const MEAL_COLORS: { [key: string]: string } = {
  "Diyanet İşleri": COLORS.primary,
  "Süleyman Ateş Meal": COLORS.secondary,
  "Elmalılı Hamdi Yazır Meal": COLORS.accent,
  "Bayraktar Bayraklı": COLORS.success,
  "Elmalılı (sadeleştirilmiş)": COLORS.info,
  "Mehmet Okuyan": COLORS.warning,
  "Mustafa İslamoğlu": COLORS.purple,
  "Muhammed Esed": COLORS.emerald,
  "Süleymaniye Vakfı": COLORS.rose,
  "İbni Kesir": COLORS.amber,
  "Gültekin Onan": COLORS.lime,
};
