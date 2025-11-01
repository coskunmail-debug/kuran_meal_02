import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions, ScrollView, Animated, Easing } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface FootnoteModalProps {
  isVisible: boolean; // Dışarıdan gelen görünürlük prop'u
  footnoteNumber: number | null;
  footnoteText: string | null;
  onClose: () => void;
}

export default function FootnoteModal({
  isVisible,
  footnoteNumber,
  footnoteText,
  onClose,
}: FootnoteModalProps) {
  const [modalVisible, setModalVisible] = useState(false); // Modal'ın 'visible' prop'u için dahili durum
  // Başlangıçta modal içeriğinin kendi yüksekliği kadar aşağıda (ekran dışında) olmasını sağlar
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height * 0.5)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true); // Modal'ı görünür yap
      Animated.timing(slideAnim, {
        toValue: 0, // İçeriği yukarı doğru kaydır (nihai konumuna)
        duration: 300,
        easing: Easing.out(Easing.ease), // Daha yumuşak bir giriş animasyonu
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height * 0.5, // İçeriği aşağı doğru kaydır (ekran dışına)
        duration: 300,
        easing: Easing.in(Easing.ease), // Daha yumuşak bir çıkış animasyonu
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false); // Animasyon tamamlandıktan sonra Modal'ı gizle
      });
    }
  }, [isVisible, slideAnim]);

  // Eğer dahili modalVisible durumu false ise, Modal'ı render etme
  if (!modalVisible) {
    return null;
  }

  const handleClose = () => {
    // Dışarıdan gelen onClose prop'unu çağır, bu isVisible'ı false yapacak ve useEffect'i tetikleyecek
    onClose();
  };

  return (
    <Modal
      animationType="fade" // Arka planın kaymadan, yumuşak bir geçişle belirmesini sağlar
      transparent={true}
      visible={modalVisible} // Dahili durumu kullan
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }, // Kaydırma animasyonunu uygula
          ]}
        >
          {/* Bu Pressable, modal içeriği içindeki dokunmaların modalı kapatmasını engeller */}
          <Pressable style={{ flex: 1 }} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dipnot {footnoteNumber}</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={COLORS.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBodyScrollView}>
              <Text style={styles.modalBodyText}>{footnoteText}</Text>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Modal ekranın altından gelsin
    alignItems: 'stretch', // Modal tam genişlikte olsun
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16, // Sadece üst köşeler yuvarlak
    borderTopRightRadius: 16,
    paddingHorizontal: 20, // Yatay dolgu korundu
    paddingTop: 20, // Üst dolgu korundu
    height: Dimensions.get('window').height * 0.5, // Ekranın yarısı kadar yükseklik
    width: '100%', // Tam genişlik
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'column', // İçerik dikey olarak sıralansın
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 5,
  },
  modalBodyScrollView: {
    flex: 1, // ScrollView kalan alanı doldursun
    paddingBottom: 20, // Kaydırılabilir içeriğin altında boşluk bırak
  },
  modalBodyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
