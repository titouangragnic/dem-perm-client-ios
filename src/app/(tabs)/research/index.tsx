import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import {RelativePathString, router, useRouter} from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { InputBar } from '@/stories/InputBar';
import { ProfileCard } from '@/stories/Profilecard';
import { Post } from '@/stories/Post';
// import { getForYouPage } from '@/api/mock/functions';
import { useThemeContext } from '@/contexts/theme-context';
import {SafeAreaView} from "react-native-safe-area-context";
import { ForYouResults } from '@/api/types/for-you-page/for-you-results';
import { postService } from '@/api/services/post.service';

export default function ResearchScreen() {
    const [searchText, setSearchText] = useState('');
    const { colorScheme } = useThemeContext();
    const router = useRouter();
    const palette = Colors[colorScheme];

    const [users, setUsers] = useState<ForYouResults['users']>([]);
    const [posts, setPosts] = useState<ForYouResults['posts']>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const res = new ForYouResults();
            res.users = []; // n'est pas implementer
            res.posts = await postService.getDiscoverPosts();
            setUsers(res.users);
            setPosts(res.posts);
        };
        fetchData();
    }, []);

    // Filtrer les résultats en fonction du texte de recherche
    const filteredUsers = useMemo(() => {
        if (!searchText.trim()) return users;
        return users.filter((profile: any) =>
            profile.user.displayName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, users]);

    const filteredPosts = useMemo(() => {
        if (!searchText.trim()) return posts;
        return posts.filter((post: any) =>
            post.content?.toLowerCase().includes(searchText.toLowerCase()) ||
            post.author.displayName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, posts]);

    function handleOpenProfile(userId: string){

        //FIXME open profile tab if it's the actual connected user
        router.push({pathname: `/(tabs)/research/profile/[id]`,
            params: { id: userId }});/* FIXME with userID*/
    }

    return (
        <ThemedView style={styles.container as ViewStyle}>
            <ScrollView
                style={styles.scrollView as ViewStyle}
                contentContainerStyle={styles.scrollContent as ViewStyle}
            >
                <SafeAreaView>
                    {/* Barre de recherche */}
                    <View style={styles.searchBarContainer as ViewStyle}>
                        <InputBar
                            onActionPress={() => {}}
                            onChangeText={setSearchText}
                            placeholder="Rechercher une personne ou un post"
                            rightIcon="search"
                            value={searchText}
                        />
                    </View>

                    {/* Section des utilisateurs - 2 par ligne */}
                    {filteredUsers.length > 0 && (
                        <View style={styles.usersGrid as ViewStyle}>
                            {filteredUsers.map((profile) => (
                                <View key={profile.user.id} style={styles.userCardWrapper as ViewStyle}>
                                    <ProfileCard
                                        avatarUri={profile.user.profilePictureUrl}
                                        bannerUri={profile.user.bannerUrl}
                                        description={profile.bio}
                                        onPressFollow={() => {}}
                                        username={profile.user.displayName}
                                        votes={profile.user.voteCount}
                                    />
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Section des posts */}
                    {filteredPosts.length > 0 && (
                        <View style={styles.postsSection as ViewStyle}>
                            {filteredPosts.map((post) => (
                                <View key={post.id} style={styles.postWrapper as ViewStyle}>
                                    <Post
                                        commentCount={post.commentCount}
                                        date={post.createdAt}
                                        images={post.medias?.map(m => m.mediaUrl) || []}
                                        level={0}
                                        likeCount={post.likeCount}
                                        onPress={() => router.push({
                                            pathname: '/(tabs)/research/postDetail',
                                            params: { id: post.id }
                                        })}
                                        onPressComment={() => {}}
                                        onPressLike={() => {}}
                                        onPressRepost={() => {}}
                                        onPressShare={() => {}}
                                        onPressUser={() => handleOpenProfile(post.author.id)}
                                        text={post.content || ''}
                                        username={post.author.displayName}
                                        avatarUri={post.author.profilePictureUrl}
                                    />
                                </View>
                            ))}
                        </View>
                    )}
                </SafeAreaView>

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    scrollView: {
        flex: 1,
    } as ViewStyle,
    scrollContent: {
        paddingBottom: Spacing.margin * 2,
    } as ViewStyle,
    searchBarContainer: {
        paddingTop: Spacing.margin,
        paddingBottom: Spacing.margin,
    } as ViewStyle,
    usersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',

    } as ViewStyle,
    userCardWrapper: {
        width: '50%',
        minWidth: 150,
    } as ViewStyle,
    postsSection: {
        marginTop: Spacing.margin,
    } as ViewStyle,
    postWrapper: {
        marginBottom: Spacing.margin,
    } as ViewStyle,
});
