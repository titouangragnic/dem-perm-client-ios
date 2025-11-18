import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FeedScreen from '../feed';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { profiles } from '@/api/mock/db';

export default function DemocracyRanking() {
  const data = profiles;
  const [selectedTab, setSelectedTab] = useState<'actualites' | 'classement' | 'retenus'>('classement');
  const [selectedCategory, setSelectedCategory] = useState<string>('Global');
  const [retained, setRetained] = useState(() => data.slice(0, 8));

  const matchesCategory = (profile: typeof data[number], cat: string) => {
    if (cat === 'Global') return true;
    const lc = cat.toLowerCase();
    if (profile.bio && profile.bio.toLowerCase().includes(lc)) return true;
    if (profile.user?.displayName && profile.user.displayName.toLowerCase().includes(lc)) return true;
    if (profile.posts && profile.posts.length) {
      for (const p of profile.posts) {
        const forumTitle = (p.forum && (p.forum.title)) as string | undefined;
        if (forumTitle && forumTitle.toLowerCase().includes(lc)) return true;
      }
    }
    return false;
  };

  const filteredData = selectedCategory === 'Global' ? data : data.filter(p => matchesCategory(p, selectedCategory));
  const filteredRetained = selectedCategory === 'Global' ? retained : retained.filter(p => matchesCategory(p, selectedCategory));

  return (
    <ThemedView style={styles.container}>
      {/* Top tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'actualites' && styles.tabSelected]}
          onPress={() => setSelectedTab('actualites')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'actualites' && styles.tabButtonTextSelected]}>Actualités</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'classement' && styles.tabSelected]}
          onPress={() => setSelectedTab('classement')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'classement' && styles.tabButtonTextSelected]}>Classement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'retenus' && styles.tabSelected]}
          onPress={() => setSelectedTab('retenus')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'retenus' && styles.tabButtonTextSelected]}>Retenus</Text>
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          {['Global', 'Culture', 'Ecologie', 'Transports', 'Education'].map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedTab === 'actualites' ? (
        <FeedScreen />
      ) : (
        <View style={styles.headerCard}>
        <Image
          source={{ uri: data[0]?.user.bannerUrl || data[0]?.user.profilePictureUrl }}
          style={styles.banner}
        />
        <View style={styles.avatarRow}>
          <Image source={{ uri: data[0]?.user.profilePictureUrl }} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{data[0]?.user.displayName}</Text>
        <Text style={styles.votesBig}>{data[0]?.voteCount} Votes</Text>
        <View style={styles.tag}><Text style={styles.tagText}>Ecologie</Text></View>
        <Text style={styles.subtitle}>Maire depuis 456 jours</Text>
        </View>

      )}

      {selectedTab !== 'actualites' && (
        selectedTab === 'retenus' ? (
          <FlatList
            data={filteredRetained}
            keyExtractor={(item, i) => String(i)}
            style={{ width: '100%' }}
            contentContainerStyle={{ padding: Spacing.padding }}
            renderItem={({ item, index }) => (
              <View style={styles.retenuItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Image source={{ uri: item.user.profilePictureUrl }} style={styles.itemAvatar} />
                  <View style={{ marginLeft: Spacing.margin, flex: 1 }}>
                    <Text style={styles.itemName}>{item.user.displayName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.itemVotes}>{item.voteCount} Votes</Text>
                      <View style={styles.smallTag}><Text style={styles.smallTagText}>Ecologie</Text></View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setRetained(r => r.filter((_, i) => i !== index))} style={styles.removeBtn}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(_, i) => String(i)}
            style={{ width: '100%' }}
            contentContainerStyle={{ padding: Spacing.padding }}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.item}>
                <Image source={{ uri: item.user.profilePictureUrl }} style={styles.itemAvatar} />
                <Text style={styles.itemName}>{item.user.displayName}</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemVotes}>{item.voteCount} Votes</Text>
                  <View style={styles.smallTag}><Text style={styles.smallTagText}>Ecologie</Text></View>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.padding,
    paddingTop: Spacing.padding,
    paddingBottom: Spacing.padding / 2,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1f1f1f',
  },
  tabSelected: { backgroundColor: '#000' },
  tabButtonText: { color: '#bdbdbd', fontWeight: '600' },
  tabButtonTextSelected: { color: '#fff' },
  chipsWrapper: { paddingBottom: Spacing.padding / 2 },
  chipsContainer: { paddingHorizontal: Spacing.padding, alignItems: 'center' },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#111',
    borderRadius: 20,
    marginRight: Spacing.margin / 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: { borderColor: '#6c63ff' },
  chipText: { color: '#cfcfcf' },
  chipTextSelected: { color: '#6c63ff' },
  headerCard: {
    margin: Spacing.margin,
    borderRadius: 12,
    padding: Spacing.padding,
    backgroundColor: '#2b2b2b',
    alignItems: 'center',
  },
  banner: { width: '100%', height: 120, borderRadius: 8, marginBottom: -40 },
  avatarRow: { marginTop: -40, marginBottom: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#fff' },
  name: { color: '#fff', fontSize: 18, marginTop: 8 },
  votesBig: { color: '#6c63ff', fontSize: 20, fontWeight: '700', marginTop: 6 },
  tag: { marginTop: 6, backgroundColor: '#1b8e3a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#fff', fontSize: 12 },
  subtitle: { color: '#bdbdbd', marginTop: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f2f2f',
    padding: Spacing.padding,
    borderRadius: 12,
    marginBottom: Spacing.margin,
  },
  itemAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: Spacing.margin },
  itemName: { color: '#fff', fontSize: 16, flex: 1 },
  itemRight: { alignItems: 'flex-end' },
  itemVotes: { color: '#6c63ff', fontWeight: '700' },
  smallTag: { backgroundColor: '#1b8e3a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 6 },
  smallTagText: { color: '#fff', fontSize: 12 },
  retenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f2f2f',
    padding: Spacing.padding,
    borderRadius: 12,
    marginBottom: Spacing.margin,
  },
  removeBtn: {
    padding: 8,
    marginLeft: 8,
  },
  removeText: {
    color: '#cfcfcf',
    fontSize: 18,
  },
});
