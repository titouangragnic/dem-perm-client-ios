import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@/contexts/theme-context';
import {Colors, VariantKey} from '@/constants/theme';

export interface SearchBarProps {
    /** Placeholder text */
    placeholder?: string;
    /** Called when text changes */
    onChangeText?: (text: string) => void;
    /** Called when pressing clear button */
    onClear?: () => void;
    /** Initial text value */
    value?: string;
    /** Optional style */
    style?: any;
    /** What background color to use */
    backgroundColor?: VariantKey;
}

/** Search bar UI component */
export const SearchBar = ({
                              placeholder = 'Rechercher...',
                              onChangeText,
                              onClear,
                              value: propValue,
                              style,
                              backgroundColor = 'background',
                          }: SearchBarProps) => {
    const { colorScheme } = useThemeContext();
    const [text, setText] = useState(propValue || '');

    const textColor = backgroundColor === "primary" || backgroundColor === "background" ?
        Colors[colorScheme].text : Colors[colorScheme].background;

    const handleChange = (val: string) => {
        setText(val);
        onChangeText?.(val);
    };

    const handleClear = () => {
        setText('');
        onClear?.();
    };

    const iconSize = 18;

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: Colors[colorScheme][backgroundColor] },
                style,
            ]}
        >
            <Ionicons
                name="search"
                size={iconSize}
                color={textColor}
            />
            <TextInput
                style={[
                    styles.input,
                    { color: textColor, fontSize: 14 },
                ]}
                placeholder={placeholder}
                placeholderTextColor={textColor}
                value={text}
                onChangeText={handleChange}
            />
            {text.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                    <Ionicons
                        name="close-circle"
                        size={iconSize}
                        color={textColor}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 10,
        gap: 8,
        padding: 16,
        margin: 8
    },
    input: {
        flex: 1,
        fontFamily: 'System',
    }
});
