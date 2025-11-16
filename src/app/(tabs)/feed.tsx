import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { getFeed } from '@/api/mock/functions';
import { SimplePost } from '@/api/types/common/simple-post';
import { Post } from '@/stories/Post';
import { Button } from '@/stories/Button';
import { useThemeContext } from '@/contexts/theme-context';

export default function FeedScreen() {
    const [posts, setPosts] = useState<SimplePost[]>([]);
    const router = useRouter();
    const { colorScheme } = useThemeContext();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const feedPosts = getFeed();
        setPosts(feedPosts);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={[styles.header, { paddingTop: insets.top + Spacing.padding }]}>
                <View style={styles.logoPlaceholder}>
                    {/* Logo à venir */}
                </View>
                <Button
                    icon="chatbubbles"
                    onPress={() => router.push('/privateMessages/conversationsList')}
                />
            </View>
            
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Post
                        username={item.author.displayName}
                        avatarUri={item.author.profilePictureUrl}
                        date={formatDate(item.createdAt)}
                        text={item.content}
                        images={item.medias.map(m => m.mediaUrl)}
                        likeCount={item.likeCount}
                        commentCount={item.commentCount}
                        level={0}
                        onPressLike={() => {}}
                        onPressComment={() => {}}
                        onPressRepost={() => {}}
                        onPressShare={() => {}}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
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
        paddingHorizontal: Spacing.margin,
        paddingBottom: Spacing.padding,
    },
    logoPlaceholder: {
        width: 40,
        height: 40,
    },
    listContent: {
        paddingBottom: Spacing.margin,
    },
});
