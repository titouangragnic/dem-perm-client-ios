import { useUser } from "@/contexts/user-context";
import { TextInput, Button, View, Text, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {router} from "expo-router";

export default function Login() {
    const { login } = useUser()!;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const e = await login(email, password);
    console.log(e);
    if (e) {
      alert("Erreur lors de la connexion: " + e)
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

                <Button title="Se connecter" onPress={handleLogin} />

                <TouchableOpacity onPress={() => router.replace("/auth/register")}>
                    <Text style={{ textAlign: "center", marginTop: 20, backgroundColor: '#fff' }}>
                        Pas de compte ? <Text style={{ fontWeight: "bold", backgroundColor: '#fff' }}>Inscrivez-vous</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
