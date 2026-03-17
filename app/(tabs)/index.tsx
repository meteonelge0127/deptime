import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [zaman, setZaman] = useState(new Date()); 
  const [gecmis, setGecmis] = useState<any[]>([]); 
  
  // Animasyon Değerleri (Dokunulmadı)
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const textTitle = useRef(new Animated.Value(0)).current;
  const introOpacity = useRef(new Animated.Value(1)).current;
  const soundObject = useRef(new Audio.Sound());

  useEffect(() => {
    // 1. SAAT MOTORU (Asla Durmaz)
    const timer = setInterval(() => setZaman(new Date()), 1000);

    // 2. SUNUCUSUZ KAYITLARI YÜKLE
    const loadStoredData = async () => {
      try {
        const saved = await AsyncStorage.getItem('@sismik_kayitlar');
        if (saved) setGecmis(JSON.parse(saved));
      } catch (e) { console.log("Lokal veri okunamadı"); }
    };
    loadStoredData();

    // 3. EFSANEVİ GİRİŞ VE SES SENARYOSU
    const startIntro = async () => {
      try {
        // Ses dosyasının assets/sounds/seismic_intro.mp3 yolunda olduğundan emin ol
        await soundObject.current.loadAsync(require('../../assets/sounds/seismic_intro.mp3'));
        await soundObject.current.playAsync();
      } catch (e) { console.log("Ses dosyası bulunamadı, sessiz devam ediliyor."); }

      Animated.stagger(400, [
        Animated.timing(wave1, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(wave2, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(textTitle, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        })
      ]).start();

      // 3 saniye sonra pürüzsüz geçiş
      setTimeout(() => {
        Animated.timing(introOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => setLoading(false));
      }, 3000);
    };

    startIntro();

    return () => {
      clearInterval(timer);
      soundObject.current.unloadAsync();
    };
  }, []);

  // SAAT ORANI: Tablette de Telefon gibi Devasa (width * 0.19)
  const responsiveFontSize = width * 0.19;

  return (
    <View style={styles.container}>
      {/* ANA PANEL (Saat ve Yerel Kayıtlar) */}
      <View style={styles.mainPanel}>
        <View style={styles.clockBox}>
          <Text style={[styles.clockText, { fontSize: responsiveFontSize }]}>
            {zaman.toLocaleTimeString('tr-TR', { hour12: false })}
          </Text>
          <Text style={styles.dateText}>
            {zaman.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
          </Text>
        </View>

        {/* Sunucusuz Geçmiş (Alt kısımda silik, profesyonel durur) */}
        {!loading && (
          <View style={styles.localDataBox}>
            {gecmis.length > 0 ? (
              gecmis.slice(0, 5).map((item, index) => (
                <Text key={index} style={styles.historyText}>
                  {item.saat} | {item.yer} | {item.siddet}
                </Text>
              ))
            ) : (
              <Text style={styles.noDataText}>SİSTEM DİNLEMEDE / YEREL KAYIT YOK</Text>
            )}
          </View>
        )}
      </View>

      {/* GİRİŞ ANİMASYONU (Üst Katman) */}
      {loading && (
        <Animated.View style={[styles.loadingOverlay, { opacity: introOpacity }]}>
          <Animated.View style={[styles.seismicWave, {
            transform: [{ scale: wave1.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) }],
            opacity: wave1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.6, 0] })
          }]} />
          <Animated.View style={[styles.seismicWave, {
            borderColor: '#ff4444',
            transform: [{ scale: wave2.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) }],
            opacity: wave2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.4, 0] })
          }]} />
          
          <Animated.View style={{ transform: [{ scale: textTitle }] }}>
            <Text style={styles.loadingTitle}>DEPTIME</Text>
            <View style={styles.pulseDot} />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  // Ana Ekran Tasarımı
  mainPanel: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  clockBox: { alignItems: 'center' },
  clockText: { color: '#fff', fontWeight: '200', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  dateText: { color: '#222', fontSize: 14, letterSpacing: 5, marginTop: 20 },
  
  // Yerel Kayıt Listesi
  localDataBox: { marginTop: 50, alignItems: 'center' },
  historyText: { color: '#111', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  noDataText: { color: '#080808', fontSize: 9, letterSpacing: 3 },

  // Animasyon Katmanı
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 10 
  },
  seismicWave: { 
    position: 'absolute', 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 1, 
    borderColor: '#ff0000' 
  },
  loadingTitle: { color: '#fff', fontSize: 40, fontWeight: '100', letterSpacing: 15 },
  pulseDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ff0000', alignSelf: 'center', marginTop: 15 }
});