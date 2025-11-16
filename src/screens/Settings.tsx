import {StyleSheet, Text, View} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {router} from "expo-router";
import {Button} from "@/stories/Button";
import {Colors} from "@/constants/theme";
import {useThemeContext} from "@/contexts/theme-context";
import {Toggle} from "@/stories/Toggle";
import {useState} from "react";
import {ThemedView} from "@/components/themed-view";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Settings() {
    const { colorScheme } = useThemeContext();
    const backgroundColor = Colors[colorScheme].primary;
    const [isShowingVote, setIsShowingVote] = useState<boolean>(false);
    const [isProfilePublic, setIsProfilePublic] = useState<boolean>(true);
    const [isLimitedToUndredVotes, setIsLimitedToUndredVotes] = useState<boolean>(false);
    const [allowedNotifications, setAllowedNotifications] = useState<boolean>(false);

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
                <ThemedText type="screenTitle" style={{marginInline: "auto"}}>Paramètres</ThemedText>
            </ThemedView>
            <ThemedView style={{flexDirection:"column"}}>
                <ThemedText type={"title"} style={{marginInline: 22}}>Démocratie</ThemedText>
                <ThemedView style={[styles.settingContainer, {backgroundColor} ]}>
                    <ThemedText type={"title"}>Montrer mon vote</ThemedText>
                    <Toggle
                    isEnabled={isShowingVote}
                    onValueChange={() => {setIsShowingVote(!isShowingVote);}}
                    />
                </ThemedView>
                <ThemedView style={[styles.settingContainer, {backgroundColor} ]}>
                    <ThemedText type={"title"}>Profil public</ThemedText>
                    <Toggle
                        isEnabled={isProfilePublic}
                        onValueChange={() => {setIsProfilePublic(!isProfilePublic);}}
                    />
                </ThemedView>
                <ThemedView style={[styles.settingContainer, {backgroundColor} ]}>
                    <ThemedText type={"title"}>Limiter à 100 voix</ThemedText>
                    <Toggle
                        isEnabled={isLimitedToUndredVotes}
                        onValueChange={() => {setIsLimitedToUndredVotes(!isLimitedToUndredVotes);}}
                    />
                </ThemedView>
                <ThemedText type={"title"} style={{marginInline: 22, marginTop: 28}}>Notifications</ThemedText>
                <ThemedView style={[styles.settingContainer, {backgroundColor} ]}>
                    <ThemedText type={"title"}>Notifications</ThemedText>
                    <Toggle
                        isEnabled={allowedNotifications}
                        onValueChange={() => {setAllowedNotifications(!allowedNotifications);}}
                    />
                </ThemedView>
            </ThemedView>
        </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    settingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        padding: 24,
        marginInline: 22,
        marginVertical: 14
    },
});