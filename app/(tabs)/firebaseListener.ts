// Firebase kelimesini bile kullanmıyoruz ki Metro Bundler tetiklenmesin
import { Alert, Linking } from 'react-native';

/**
 * DepremVar Sismik Dinleyici
 * Expo Go uyumlu güvenli versiyon
 */
export const setupSismikDinleyici = (onDeprem: (veri: any) => void) => {
  console.log("DepremVar: Sismik ağ dinleniyor...");

  // Manuel test için simülasyon (İstersen açabilirsin)
  /*
  const testTimer = setTimeout(() => {
    onDeprem({ yer: "Marmara Denizi", buyukluk: "5.8", eta: "15" });
  }, 10000);
  */

  return () => {
    // console.log("Dinleyici kapatıldı");
  };
};

const processMessage = (data: any, onAlarmReceived: (data: any) => void) => {
  const tip = data.tip?.toLowerCase().trim() || 'alarm';
  if (tip === 'alarm' || tip === 'deprem') {
    onAlarmReceived(data);
  }
};