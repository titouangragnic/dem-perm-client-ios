import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';
import { Domain } from '@/stories/Domain';
import { getDomains } from '@/api/mock/functions';
import { Domain as DomainType } from '@/api/types/forum/domain';
import { iconVariants } from '@/stories/utils';


// Mapping des domaines vers des icônes
    const getDomainIcon = (domainName: string): iconVariants => {
    const lowerName = domainName.toLowerCase();
    if (lowerName.includes('écologie') || lowerName.includes('environnement')) {
        return 'megaphone';
    } else if (lowerName.includes('culture')) {
        return 'heart';
    } else if (lowerName.includes('transport')) {
        return 'paper-plane';
    } else if (lowerName.includes('santé')) {
        return 'heart';
    } else if (lowerName.includes('éducation')) {
        return 'newspaper';
    }
    return 'megaphone'; // Icône par défaut
};

export default function ForumsDiscoverScreen() {
    const { colorScheme } = useThemeContext();
    const router = useRouter();
    const [domains, setDomains] = useState<DomainType[]>([]);

    useEffect(() => {
        // Charger les domaines au montage du composant
        const loadedDomains = getDomains();
        setDomains(loadedDomains);
    }, []);

    const handleDomainPress = (domainId: number) => {
        // Navigation vers la page des forums du domaine
        router.push({
            pathname: '/(tabs)/forums/themeForums',
            params: { domainId }
        });
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView 
                style={[styles.scrollView, { backgroundColor: Colors[colorScheme].background }]}
            >
                <ThemedView style={styles.domainsContainer}>
                    {domains.map((domain) => (
                        <Domain
                            key={domain.id}
                            icon={getDomainIcon(domain.name)}
                            label={domain.name}
                            onPress={() => handleDomainPress(domain.id)}
                            thickness={32}
                        />
                    ))}
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingBottom: Spacing.padding,
        marginHorizontal: Spacing.margin,
    },
    segmentedControl: {
        flexDirection: 'row',
        borderRadius: Spacing.borderRadius,
        padding: 4,
        gap: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: Typography.sizes.general,
        fontWeight: Typography.weights.semiBold,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    domainsContainer: {
        gap: Spacing.margin,
        margin: Spacing.margin,
    },
});
