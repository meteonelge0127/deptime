import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Ayarlar() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ayarlar Sayfası (Firebase Devre Dışı)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff' }
});