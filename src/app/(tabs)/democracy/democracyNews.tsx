import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { ThemeDemo } from '@/components/theme-demo';
import {HelloWave} from "@/components/hello-wave";

export default function DemocracyNewsScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: Colors.light.primary, dark: Colors.dark.primary }}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="screenTitle">Les actualités en démocracie</ThemedText>
            </ThemedView>
            <ThemedView style={styles.navContainer}>
            <ThemedView style={styles.titleContainer}>
                <Link href="/democracy/democracyNews">
                   <ThemedText type="link">Actualités</ThemedText>
                </Link>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                <Link href="/democracy/democracyRanking">
                    <ThemedText type="link">Classement</ThemedText>
                </Link>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                <Link href="/democracy/democracyRetained">
                    <ThemedText type="link">Retenus</ThemedText>
                </Link>
            </ThemedView>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: Spacing.margin,
    },
    navContainer: {
        flexDirection: 'row',
        gap: Spacing.margin,
    },
});
