import React, { useState } from "react";
import { TextInput, Button, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/contexts/user-context";
import {router} from "expo-router";

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

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <View style={{ gap: 12 }}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    style={{ borderWidth: 1, padding: 10, borderRadius: 8, backgroundColor: "#fff" }}
                />

                <TextInput
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ borderWidth: 1, padding: 10, borderRadius: 8, backgroundColor: "#fff" }}
                />

                <Button title="Créer un compte" onPress={handleRegister} />

                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                    <Text style={{ textAlign: "center", marginTop: 20, backgroundColor: '#fff' }}>
                        Déjà un compte ? <Text style={{ fontWeight: "bold", backgroundColor: '#fff' }}>Connectez-vous</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
