import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
    ImageBackground,
    Image as RNImage,
} from 'react-native';
import { useThemeContext } from '@/contexts/theme-context';
import { Colors } from '@/constants/theme';
import { fontFamily } from '@/stories/utils';

export type DomainBackground =
    | 'Culture'
    | 'Education'
    | 'Emploi'
    | 'Environnement'
    | 'Numerique'
    | 'Sante'
    | 'Securite'
    | 'Sport'
    | 'Transport';

const DOMAIN_IMAGES = {
    Culture: require('../assets/Domains/Culture.png'),
    Education: require('../assets/Domains/Education.png'),
    Emploi: require('../assets/Domains/Emploi.png'),
    Environnement: require('../assets/Domains/Environnement.png'),
    Numerique: require('../assets/Domains/Numerique.png'),
    Sante: require('../assets/Domains/Sante.png'),
    Securite: require('../assets/Domains/Securite.png'),
    Sport: require('../assets/Domains/Sport.png'),
    Transport: require('../assets/Domains/Transport.png'),
} as const;

export interface DomainProps {
    label: string;
    background: DomainBackground;
    onPress?: () => void;

    /** Optional explicit width (useful in grids). If omitted, parent controls width. */
    width?: number;

    /** Text color */
    textColor?: string;

    style?: StyleProp<ViewStyle>;
}

/** Domain card */
export const Domain = ({
                           label,
                           background,
                           onPress,
                           width,
                           textColor,
                           style,
                       }: DomainProps) => {
    const { colorScheme } = useThemeContext();
    const defaultTextColor = Colors[colorScheme].text;

    const source = DOMAIN_IMAGES[background];

    const aspectRatio = useMemo(() => {
        const resolved = RNImage.resolveAssetSource(source);
        // fallback if something goes wrong
        if (!resolved?.width || !resolved?.height) return 16 / 9;
        return resolved.width / resolved.height;
    }, [source]);

    return (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            accessibilityRole="button"
            style={[
                styles.container,
                width ? { width } : null,
                { aspectRatio },
                style,
            ]}
        >
            <ImageBackground
                source={source}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={styles.image}
            >
                <View style={styles.center}>
                    <Text
                        numberOfLines={2}
                        style={[
                            styles.label,
                            { color: textColor ?? defaultTextColor, fontFamily },
                        ]}
                    >
                        {label}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderRadius: 16,
    },
    center: {
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
});
