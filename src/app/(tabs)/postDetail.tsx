import { getPost } from '@/api/mock/functions';
import { Comment as CommentType } from '@/api/types/post/comment';
import { FullPost } from '@/api/types/post/full-post';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';
import { Comment } from '@/stories/Comment';
import { Post } from '@/stories/Post';
import { fontFamily } from '@/stories/utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PostDetailScreen() {
    const [fullPost, setFullPost] = useState<FullPost | null>(null);
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colorScheme } = useThemeContext();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const postId = parseInt(params.id as string);
        if (postId) {
            const post = getPost(postId);
            if (post) {
                setFullPost(post);
            }
        }
    }, [params.id]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Fonction récursive pour aplatir les commentaires avec leur niveau
    const flattenComments = (comments: CommentType[], level = 0, parentPath: number[] = []): Array<CommentType & { level: number; hasNextSibling: boolean }> => {
        let result: Array<CommentType & { level: number; hasNextSibling: boolean }> = [];
        comments.forEach((comment, index) => {
            const hasNextSibling = index < comments.length - 1;
            result.push({ ...comment, level, hasNextSibling });
            if (comment.subComments && comment.subComments.length > 0) {
                result = result.concat(flattenComments(comment.subComments, level + 1, [...parentPath, index]));
            }
        });
        return result;
    };

    const flatComments = fullPost ? flattenComments(fullPost.comments) : [];

    if (!fullPost) {
        return (
            <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
                <View style={[styles.header, { paddingTop: insets.top + Spacing.padding }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: Colors[colorScheme].text, fontFamily }]}>
                        Post non trouvé
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={[styles.header, { paddingTop: insets.top + Spacing.padding }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: Colors[colorScheme].text, fontFamily }]}>
                    Post
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={flatComments}
                keyExtractor={(item) => item.commentId.toString()}
                ListHeaderComponent={
                    <Post
                        username={fullPost.post.author.displayName}
                        avatarUri={fullPost.post.author.profilePictureUrl}
                        date={formatDate(fullPost.post.createdAt)}
                        text={fullPost.post.content}
                        images={fullPost.post.medias.map(m => m.mediaUrl)}
                        likeCount={fullPost.post.likeCount}
                        commentCount={fullPost.post.commentCount}
                        level={0}
                        onPressLike={() => {}}
                        onPressComment={() => {}}
                        onPressRepost={() => {}}
                        onPressShare={() => {}}
                    />
                }
                renderItem={({ item }) => (
                    <Comment
                        username={item.author.displayName}
                        avatarUri={item.author.profilePictureUrl}
                        createdAt={item.createdAt}
                        text={item.content}
                        likeCount={0}
                        commentCount={item.subComments?.length || 0}
                        level={item.level}
                        hasNextSibling={item.hasNextSibling}
                        onPressLike={() => {}}
                        onPressComment={() => {}}
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
    backButton: {
        padding: Spacing.padding / 2,
        marginLeft: -Spacing.padding / 2,
    },
    headerTitle: {
        fontSize: Typography.sizes.screenTitle,
        fontWeight: Typography.weights.semiBold as any,
    },
    headerSpacer: {
        width: 40,
    },
    listContent: {
        paddingBottom: Spacing.margin,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: Typography.sizes.general,
    },
});
