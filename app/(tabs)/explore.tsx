import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

export default function HaritaEkrani() {
  const [depremler, setDepremler] = useState([]);

  const verileriGetir = async () => {
    try {
      const response = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
      const json = await response.json();
      setDepremler(json.result.slice(0, 50)); // Haritada son 50 depremi göster
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    verileriGetir();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 39.0, // Türkiye merkezi
          longitude: 35.0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        userInterfaceStyle="dark"
      >
        {depremler.map((item, index) => (
          <React.Fragment key={index}>
            <Marker
              coordinate={{
                latitude: item.geojson.coordinates[1],
                longitude: item.geojson.coordinates[0],
              }}
              title={item.title}
              description={`Şiddet: ${item.mag} - Derinlik: ${item.depth}km`}
            />
            <Circle
              center={{
                latitude: item.geojson.coordinates[1],
                longitude: item.geojson.coordinates[0],
              }}
              radius={item.mag * 5000} // Şiddete göre halkanın büyüklüğü
              fillColor={item.mag >= 4 ? "rgba(255, 0, 0, 0.3)" : "rgba(255, 255, 0, 0.2)"}
              strokeColor="transparent"
            />
          </React.Fragment>
        ))}
      </MapView>
      <View style={styles.headerOverlay}>
        <Text style={styles.overlayText}>Canlı Sismik Harita</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 20 },
  overlayText: { color: '#fff', fontWeight: 'bold' }
});