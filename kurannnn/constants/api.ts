export const ACİK_KURAN_API_BASE_URL = "https://api.acikkuran.com";
export const AUTHORS_API_URL = `${ACİK_KURAN_API_BASE_URL}/authors`;

// Uygulamadaki meal isimlerini, Acik Kuran API'sinin kullandığı yazar isimleriyle eşleştirme
// Bu isimler, /authors endpoint'inden gelen 'name' alanıyla birebir eşleşmelidir.
export const MEAL_API_AUTHORS: { [key: string]: string } = {
  "Diyanet İşleri": "Diyanet İşleri",
  "Süleyman Ateş Meal": "Süleyman Ateş",
  "Elmalılı Hamdi Yazır Meal": "Elmalılı Hamdi Yazır",
  "Bayraktar Bayraklı": "Bayraktar Bayraklı",
  "Elmalılı (sadeleştirilmiş)": "Elmalılı (sadeleştirilmiş)", // API'deki yazar adı ile eşleşecek şekilde düzeltildi
  "Mehmet Okuyan": "Mehmet Okuyan",
  "Mustafa İslamoğlu": "Mustafa İslamoğlu",
  "Muhammed Esed": "Muhammed Esed",
  "Süleymaniye Vakfı": "Süleymaniye Vakfı",
  "İbni Kesir": "İbni Kesir",
  "Gültekin Onan": "Gültekin Onan",
};
