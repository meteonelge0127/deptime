import { Alert, Linking } from 'react-native';

export const setupFcmListener = (onAlarmReceived: (data: any) => void) => {
  const initializeFirebase = async () => {
    try {
      // Dinamik require ile Expo Go çökmesini engelle
      const messaging = require('@react-native-firebase/messaging').default;
      const fcm = messaging();

      // Kotlin'deki onMessageReceived karşılığı
      const unsubscribe = fcm.onMessage(async (remoteMessage: any) => {
        const data = remoteMessage.data;
        if (data) processMessage(data, onAlarmReceived);
      });

      // Kotlin'deki onNewToken ve subscribeToTopic mantığı
      await fcm.subscribeToTopic('deprem_alarm');
      
      return unsubscribe;
    } catch (error) {
      console.log("FCM simülasyon modu: Yerel modül yok (Expo Go).");
      return () => {};
    }
  };

  let unsubscribeFn: () => void = () => {};
  initializeFirebase().then(unsub => { if (unsub) unsubscribeFn = unsub; });

  return () => unsubscribeFn();
};

const processMessage = (data: any, onAlarmReceived: (data: any) => void) => {
  const tip = data.tip?.toLowerCase().trim() || 'alarm';

  if (tip === 'alarm' || tip === 'deprem') {
    onAlarmReceived(data); // Kandilli'den gelen deprem verisi
  } else if (tip === 'guncelleme') {
    Alert.alert("DepremVar Güncelleme", "Yeni sürüm hazır!", [
      { text: "İndir", onPress: () => Linking.openURL(data.url) }
    ]);
  }
};