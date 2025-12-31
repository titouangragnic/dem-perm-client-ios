import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
    Image,
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

// ⚠️ Keep these paths RELATIVE (Metro often won't resolve @/ in require())
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
    /** Fixed height of the button (drives image scaling) */
    height?: number;
    /** Text color */
    textColor?: string;
    style?: StyleProp<ViewStyle>;
}

export const Domain = ({
                           label,
                           background,
                           onPress,
                           height = 120,
                           textColor,
                           style,
                       }: DomainProps) => {
    const { colorScheme } = useThemeContext();
    const defaultTextColor = Colors[colorScheme].text;
    const fallbackBg = Colors[colorScheme].primary;

    const source = DOMAIN_IMAGES[background];

    const { imageWidth, marginLeft } = useMemo(() => {
        const resolved = Image.resolveAssetSource(source);
        const ratio =
            resolved?.width && resolved?.height ? resolved.width / resolved.height : 1;

        // Scale image by HEIGHT: width = height * ratio
        const w = Math.round(height * ratio);

        // Center horizontally: left 50% + negative half width
        return { imageWidth: w, marginLeft: -w / 2 };
    }, [source, height]);

    return (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            accessibilityRole="button"
            style={[styles.container, { height, backgroundColor: fallbackBg }, style]}
        >
            {/* Background image scaled by height — top/bottom always visible */}
            <Image
                source={source}
                style={[
                    styles.bgImage,
                    {
                        height,
                        width: imageWidth,
                        marginLeft,
                    },
                ]}
                // We already preserve aspect ratio via width/height, so this is safe
                resizeMode="stretch"
            />

            {/* Centered label */}
            <View style={styles.content}>
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden', // crops only sides when image is wider
        justifyContent: 'center',
    },
    bgImage: {
        position: 'absolute',
        left: '50%',
        top: 0,
    },
    content: {
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
});
