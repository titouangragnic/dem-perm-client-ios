import React, { useState } from "react";
import {TextInput, View, Text, TouchableOpacity, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/contexts/user-context";
import {router} from "expo-router";
import {ThemedView} from "@/components/themed-view";
import {InputBar} from "@/stories/InputBar";
import {ThemedText} from "@/components/themed-text";
import {Colors, Spacing, Typography} from "@/constants/theme";
import {useThemeContext} from "@/contexts/theme-context";
import {Button} from "@/stories/Button";

export default function Register() {
    const { register } = useUser()!;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
      const e = await register(email, password);
      if (e) {
        alert("Erreur lors de l'inscription: " + e)
      }
    }

    const { colorScheme } = useThemeContext();
    const primaryColor = Colors[colorScheme].primary;
    const backgroundColor = Colors[colorScheme].background;

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: backgroundColor}]}>
            <ThemedView style={[styles.loginContainer, {backgroundColor: primaryColor}]}>
                <ThemedText style={styles.title}>
                    S'inscrire
                </ThemedText>
                <InputBar
                    backgroundColor="background"
                    hideRightIcon
                    onChangeText={setEmail}
                    placeholder="Email"
                    rightIcon="search"
                />

                <InputBar
                    backgroundColor="background"
                    hideRightIcon
                    onChangeText={setPassword}
                    placeholder="Mot de passe"
                    rightIcon="search"
                />

                <Button
                    label="S'inscrire"
                    onPress={handleRegister}
                    style={styles.loginButton}
                    size={"large"}
                />

                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                    <ThemedText style={styles.bottomLinkText}>
                        Vouos avez déjà un compte ? <ThemedText>Connectez-vous</ThemedText>
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "red",
        justifyContent: "center"
    },
    loginContainer: {
        backgroundColor: "blue",
        borderRadius: 12,
        margin: Spacing.margin
    },
    loginButton: {
        marginHorizontal: Spacing.margin,
        marginTop: Spacing.margin
    },
    bottomLinkText: {
        margin: Spacing.margin,
        marginTop: Spacing.margin * 2,
        alignSelf: "center",
    },
    title: {
        alignSelf: "center",
        fontSize: Typography.sizes.title,
        fontWeight: Typography.weights.semiBold,
        margin: Spacing.margin,
    }
})