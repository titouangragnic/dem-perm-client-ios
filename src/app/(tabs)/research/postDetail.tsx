import { getPost } from '@/api/mock/functions';
import { postService, CreateCommentDto } from '@/api/services/post.service';
import { Comment as CommentType } from '@/api/types/post/comment';
import { FullPost } from '@/api/types/post/full-post';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';
import { InputBar } from '@/stories/InputBar';
import { Post } from '@/stories/Post';
import { fontFamily } from '@/stories/utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FlatComment = CommentType & {
    level: number;
};

export default function PostDetailScreen() {
    const [fullPost, setFullPost] = useState<FullPost | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [commentText, setCommentText] = useState('');
    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colorScheme } = useThemeContext();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const handleGetData = async () => {
        const postId = params.id as string;
        if (postId) {
            const post = await postService.getPostById(postId);
            if (post) {
                // Charger les commentaires depuis l'API
                try {
                    const commentsData = await postService.getPostComments(postId);
                    // Convertir les commentaires plats en structure hiérarchisée
                    post.comments = postService.convertFlatCommentsToHierarchical(commentsData);
                } catch (error) {
                    console.error('Erreur lors du chargement des commentaires:', error);
                    post.comments = [];
                }
                setFullPost(post);
            }
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleGetData();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        handleGetData();
    }, []);

    useEffect(() => {
        handleGetData();
    }, [params.id]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const flattenComments = (
        comments: CommentType[],
        level = 0
    ): FlatComment[] => {
        let result: FlatComment[] = [];
        comments.forEach((comment) => {
            result.push({ ...comment, level });
            if (comment.subComments && comment.subComments.length > 0) {
                result = result.concat(
                    flattenComments(comment.subComments, level + 1)
                );
            }
        });
        return result;
    };

    const flatComments: FlatComment[] = fullPost
        ? flattenComments(fullPost.comments)
        : [];

    const handleLike = async (postId: string, isComment: boolean = false) => {
        if (!fullPost) return;

        const isLiked = isComment 
            ? likedPosts.has(postId) 
            : fullPost.post.id === postId && fullPost.post.liked;
        
        // Optimistic update
        setFullPost((prev) => {
            if (!prev) return prev;
            const newLikeCount = 
                typeof prev.post.likeCount === "number"
                    ? isLiked
                        ? prev.post.likeCount - 1
                        : prev.post.likeCount + 1
                    : isLiked
                    ? 0
                    : 1;
            return {
                ...prev,
                post: {
                    ...prev.post,
                    liked: !isLiked,
                    likeCount: newLikeCount,
                },
            };
        });

        try {
            if (isLiked) {
                await postService.unlikePost(postId);
            } else {
                await postService.likePost(postId);
            }
        } catch (e) {
            // Revert on error
            handleGetData();
        }
    };

    const handleCreateComment = async () => {
        if (!fullPost || !commentText.trim()) return;

        setIsCreatingComment(true);
        try {
            const createCommentDto: CreateCommentDto = {
                content: commentText,
                parent_comment_id: null,
            };
            await postService.createComment(fullPost.post.id, createCommentDto);
            setCommentText('');
            // Recharger les commentaires
            await handleGetData();
        } catch (error) {
            console.error('Erreur lors de la création du commentaire:', error);
        } finally {
            setIsCreatingComment(false);
        }
    };

    if (!fullPost) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: Colors[colorScheme].background },
                ]}
            >
                <View
                    style={[
                        styles.header,
                        { paddingTop: insets.top + Spacing.padding },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={Colors[colorScheme].text}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyContainer}>
                    <Text
                        style={[
                            styles.emptyText,
                            { color: Colors[colorScheme].text, fontFamily },
                        ]}
                    >
                        Post non trouvé
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: Colors[colorScheme].background },
            ]}
        >
            <View
                style={[
                    styles.header,
                    { paddingTop: insets.top + Spacing.padding },
                ]}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors[colorScheme].text}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: Colors[colorScheme].text, fontFamily },
                    ]}
                >
                    Post
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={flatComments}
                keyExtractor={(item) => item.commentId.toString()}
                ListHeaderComponent={
                    <>
                        <Post
                            username={fullPost.post.author.displayName}
                            avatarUri={fullPost.post.author.profilePictureUrl}
                            date={formatDate(fullPost.post.createdAt)}
                            title={fullPost.post.title}
                            text={fullPost.post.content}
                            images={fullPost.post.medias.map((m) => m.mediaUrl)}
                            likeCount={fullPost.post.likeCount}
                            commentCount={fullPost.post.commentCount}
                            level={0}
                            liked={fullPost.post.liked ?? false}
                            onPressLike={() => handleLike(fullPost.post.id)}
                            onPressComment={() => {}}
                            onPressRepost={() => {}}
                            onPressShare={() => {}}
                        />
                        <View style={styles.postCommentSeparator} />
                    </>
                }
                ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
                renderItem={({ item }) => (
                    <Post
                        username={item.author.displayName}
                        avatarUri={item.author.profilePictureUrl}
                        date={item.createdAt}
                        text={item.content}
                        images={[]}
                        likeCount={0}
                        commentCount={item.subComments?.length || 0}
                        level={item.level + 1}
                        // liked={likedPosts.has(item.commentId)}
                        // onPressLike={() => handleLike(item.commentId)}
                        onPressComment={() => {}}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl
                    refreshing={refreshing} onRefresh={onRefresh} />}
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
    postCommentSeparator: {
        height: Spacing.margin,
    },
    commentSeparator: {
        height: Spacing.margin,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: Typography.sizes.general,
    },
    inputContainer: {
        paddingHorizontal: Spacing.margin,
        paddingTop: Spacing.padding,
    },
});
