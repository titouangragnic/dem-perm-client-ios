import React from 'react';
import { StyleSheet } from 'react-native';
import Settings from "@/screens/Settings";

export default function SettingsScreen() {
  return (
    <Settings/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
});
