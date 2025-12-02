import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Added useLocalSearchParams
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { InputBar } from '@/stories/InputBar';
import { Button } from '@/stories/Button';
import { postService } from "@/api/services/post.service";
import { SimpleForum } from "@/api/types/forum/simple-forum"; // Ensure this path is correct

export default function CreatePostScreen() {
  const router = useRouter();
  const { forumData } = useLocalSearchParams<{ forumData: string }>(); // Retrieve param
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Parse the forum object safely
  const targetForum: SimpleForum | null = useMemo(() => {
    if (!forumData) return null;
    try {
      return JSON.parse(forumData);
    } catch (e) {
      console.error("Failed to parse forum data", e);
      return null;
    }
  }, [forumData]);

  const handleAddMedia = () => {
    console.log('Add media pressed');
  };

  const handlePublish = async () => {
    if (!targetForum) {
      console.error("No forum selected");
      return;
    }

    const payload = {
      title,
      content,
      medias: [],
      subforum_id: targetForum.id.toString(), // Use the ID from the param
    };

    try {
      await postService.createPost(payload);
      router.back();
    } catch (error) {
      console.error("Failed to publish post", error);
      // Handle error (e.g. show toast)
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === 'light'
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.padding,
            backgroundColor:
              colorScheme === 'light'
                ? Colors.light.background
                : Colors.dark.background,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.leftButton}
        >
          <IconSymbol
            name="chevron.left"
            size={24}
            color={
              colorScheme === 'light'
                ? Colors.light.text
                : Colors.dark.text
            }
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>
            Créer un poste
          </ThemedText>
          {/* Optional: Show which forum we are posting to */}
          {targetForum && (
            <ThemedText style={styles.subHeaderTitle}>
              dans {targetForum.title}
            </ThemedText>
          )}
        </View>

        <View style={styles.rightButton} />
      </View>

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.flex}>
          <View style={styles.content}>
            <ThemedText style={styles.label}>
              Titre du poste
            </ThemedText>

            <InputBar
              placeholder="Titre ..."
              value={title}
              onChangeText={setTitle}
              backgroundColor="background"
              hideRightIcon
              bigInput={false}
              style={styles.titleInput}
            />

            {/* Post label */}
            <ThemedText style={styles.label}>Poste</ThemedText>

            {/* Content input (big) */}
            <InputBar
              placeholder="Contenu ..."
              value={content}
              onChangeText={setContent}
              bigInput
              hideRightIcon
              style={styles.contentInput}
            />

            <Button
              icon="image"
              size="large"
              backgroundColor="primary"
              label="Ajouter un média"
              onPress={handleAddMedia}
            />
          </View>

          <ThemedView style={styles.footer}>
            {targetForum &&
            <Button
              size="large"
              backgroundColor="highlight1"
              label="Publier"
              onPress={handlePublish}
              style={styles.publishButton}
            />}
          </ThemedView>
        </View>
      </TouchableWithoutFeedback>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.padding,
    paddingBottom: Spacing.padding,
  },
  leftButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    width: 40,
    height: 40,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.screenTitle,
    fontWeight: Typography.weights.semiBold,
  },
  subHeaderTitle: {
    fontSize: Typography.sizes.general,
    color: Colors.light.icon, // Adjust based on your theme logic
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.padding,
    paddingTop: Spacing.padding,
    gap: Spacing.margin,
  },
  label: {
    fontSize: Typography.sizes.general,
    fontWeight: Typography.weights.semiBold,
    marginBottom: 4,
  },
  titleInput: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  contentInput: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  footer: {
    paddingHorizontal: Spacing.padding,
    paddingBottom: Spacing.padding,
  },
  publishButton: {
    alignSelf: 'stretch',
  },
});