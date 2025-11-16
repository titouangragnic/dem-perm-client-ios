import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import {Link, router} from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {Button} from "@/stories/Button";
import {SafeAreaView} from "react-native-safe-area-context";
import {MyVotes} from "@/api/types/profile/my-votes";
import {getMyVotes} from "@/api/mock/functions";
import {ListItem} from "@/stories/ListItem";
import {Ministere} from "@/stories/utils";

export default function VotesScreen() {
    const [myVotes, setMyVotes] = useState<MyVotes>()
    const hardcodedDomains : Ministere[]= ["Culture", "Écologie", "Enseignement supérieur", "Défense", "Europe", "Transports"]; //FIXME with the right domains

    useEffect(() => {
        const _myVotes = getMyVotes();
        setMyVotes(_myVotes);
    })

    return(
        <SafeAreaView>
            <ThemedView>
                <ThemedView style={{flexDirection:"row", marginVertical: 20}}>
                    <Button
                        backgroundColor="background"
                        icon="chevron-back"
                        label=""
                        onPress={() => {router.back()}}
                        size="large"
                        style={{position: "absolute"}}
                    />
                    <ThemedText type="screenTitle" style={{marginInline: "auto"}}>Récapitulatif de mes votes</ThemedText>
                </ThemedView>
                {
                    myVotes?.map(vote =>
                        <ListItem
                            key={vote.id}
                            avatarUrl={vote.profilePictureUrl}
                            username={vote.displayName}
                            votes={vote.voteCount}
                            isDeleteVisible
                            ministry={hardcodedDomains[vote.id]}
                        />
                    )
                }
            </ThemedView>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
});
