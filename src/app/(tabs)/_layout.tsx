import { Tabs, useRouter, usePathname } from 'expo-router';
import React from 'react';

import { BottomBar, BottomBarKey } from '@/stories/BottomBar';

// Mapping entre les clés du BottomBar et les routes de l'app
const routeMap: Record<BottomBarKey, string> = {
  home: '/feed',
  search: '/research',
  newspaper: '/democracy',
  chatbubbles: '/forums',
  person: '/profile',
};

// Mapping inverse : route -> clé BottomBar
const pathToKey: Record<string, BottomBarKey> = {
  '/feed': 'home',
  '/research': 'search',
  '/democracy': 'newspaper',
  '/forums': 'chatbubbles',
  '/profile': 'person',
  '/': 'home',
};

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Détermine l'onglet actif en fonction du pathname
  const activeTab = pathToKey[pathname] || 'home';

  const handleTabPress = (key: BottomBarKey) => {
    const route = routeMap[key];
    router.push(route as any);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => (
        <BottomBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="research" />
        <Tabs.Screen
          name="democracy"
          options={{
            title: 'Démocratie',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
          }}
        />
      <Tabs.Screen name="forums" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
