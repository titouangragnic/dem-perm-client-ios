import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function VotesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="screenTitle">Récapitulatif des votes</ThemedText>

      <Link href="/profile">
        <ThemedText type="link">Retour au profil</ThemedText>
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
