import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#ff3b30',
      tabBarStyle: { backgroundColor: '#000', borderTopWidth: 0, height: 60 },
      headerShown: false 
    }}>
      <Tabs.Screen name="index" options={{ title: 'Gözlem', tabBarIcon: ({ color }) => <Ionicons name="analytics" size={24} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Harita', tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Ayarlar', tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} /> }} />
    </Tabs>
  );
}