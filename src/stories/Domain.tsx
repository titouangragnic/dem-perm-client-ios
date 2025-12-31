import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
    ImageBackground,
    ImageSourcePropType,
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

/** Background images mapping */
const DOMAIN_IMAGES: Record<DomainBackground, ImageSourcePropType> = {
    Culture: require('../assets/Domains/Culture.png'),
    Education: require('../assets/Domains/Education.png'),
    Emploi: require('../assets/Domains/Emploi.png'),
    Environnement: require('../assets/Domains/Environnement.png'),
    Numerique: require('../assets/Domains/Numerique.png'),
    Sante: require('../assets/Domains/Sante.png'),
    Securite: require('../assets/Domains/Securite.png'),
    Sport: require('../assets/Domains/Sport.png'),
    Transport: require('../assets/Domains/Transport.png'),
};

export interface DomainProps {
    /** Titre à afficher */
    label: string;
    /** Image de fond */
    background: DomainBackground;
    /** Action au clic */
    onPress?: () => void;
    /** Hauteur verticale */
    thickness?: number;
    /** Couleur du texte */
    textColor?: string;
    /** Style personnalisé */
    style?: StyleProp<ViewStyle>;
}

/** Carte Domain — image de fond + texte centré */
export const Domain = ({
                           label,
                           background,
                           onPress,
                           thickness = 32,
                           textColor,
                           style,
                       }: DomainProps) => {
    const { colorScheme } = useThemeContext();
    const defaultTextColor = Colors[colorScheme].text;

    return (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            accessibilityRole="button"
            style={[styles.container, style]}
        >
            <ImageBackground
                source={DOMAIN_IMAGES[background]}
                resizeMode="cover"
                style={[styles.imageBackground, { paddingVertical: thickness }]}
                imageStyle={styles.image}
            >
                <View style={styles.overlay}>
                    <Text
                        numberOfLines={2}
                        style={[
                            styles.label,
                            {
                                color: textColor ?? defaultTextColor,
                                fontFamily,
                            },
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
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 80,
    },
    image: {
        borderRadius: 16,
    },
    overlay: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
});
