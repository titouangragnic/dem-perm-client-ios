import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="screenTitle">Profil</ThemedText>

      <Link href="/profile/settings">
        <ThemedText type="link">Paramètres</ThemedText>
      </Link>

      <Link href="/profile/votes">
        <ThemedText type="link">Récapitulatif des votes</ThemedText>
      </Link>
      
      <Link href="/profile/create-post">
        <ThemedText type="link">Créer un post</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
});
