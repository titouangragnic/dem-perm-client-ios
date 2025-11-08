import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ThemeProvider } from '@/contexts/theme-context';
import { fn } from 'storybook/test';
import { SearchBar } from './SearchBar';

const meta = {
    title: 'Interact/SearchBar',
    component: SearchBar,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <View style={{ flex: 1, alignItems: 'stretch', padding: 16 }}>
                    <Story />
                </View>
            </ThemeProvider>
        ),
    ],
    tags: ['autodocs'],
    args: {
        onChangeText: fn(),
        onClear: fn(),
    },
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};