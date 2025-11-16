import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { getChats } from '@/api/mock/functions';
import { SimpleChat } from '@/api/types/chat/simple-chat';
import { useTheme } from '@/hooks/use-theme';

export default function ConversationsListScreen() {
    const router = useRouter();
    const { colorScheme } = useTheme();
    const insets = useSafeAreaInsets();
    const chats = getChats();

    const renderConversationItem = ({ item }: { item: SimpleChat }) => (
        <TouchableOpacity
            style={[
                styles.conversationItem,
                { backgroundColor: colorScheme === 'light' ? Colors.light.primary : Colors.dark.primary }
            ]}
            onPress={() => router.push(`/privateMessages/singleConversation?id=${item.id}`)}
        >
            <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                    {item.user.displayName.charAt(0).toUpperCase()}
                </ThemedText>
            </View>
            <ThemedText style={styles.userName}>{item.user.displayName}</ThemedText>
            <IconSymbol
                name="chevron.right"
                size={20}
                color={colorScheme === 'light' ? Colors.light.text : Colors.dark.text}
                style={styles.chevron}
            />
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[
                styles.header,
                { 
                    backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background,
                    paddingTop: insets.top + Spacing.padding
                }
            ]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.leftButton}>
                    <View style={styles.buttonPlaceholder} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Messages privés</ThemedText>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol
                        name="chevron.left"
                        size={24}
                        color={colorScheme === 'light' ? Colors.light.text : Colors.dark.text}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={chats}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.padding,
        paddingBottom: Spacing.padding,
    },
    backButton: {
        width: 40,
    },
    leftButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Typography.sizes.screenTitle,
        fontWeight: Typography.weights.semiBold,
    },
    rightButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPlaceholder: {
        width: 30,
        height: 30,
        backgroundColor: '#CCCCCC',
        borderRadius: 4,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: Spacing.padding,
        gap: Spacing.margin,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.padding,
        borderRadius: Spacing.borderRadius,
        marginBottom: Spacing.margin,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.padding,
    },
    avatarText: {
        fontSize: Typography.sizes.title,
        fontWeight: Typography.weights.semiBold,
    },
    userName: {
        flex: 1,
        fontSize: Typography.sizes.general,
        fontWeight: Typography.weights.regular,
    },
    chevron: {
        marginLeft: 'auto',
    },
});