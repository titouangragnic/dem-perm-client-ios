// auth.ts
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {GoogleAuthProvider, signInWithCredential, UserCredential} from "firebase/auth";
import { auth } from "@/auth/firebase-config";  // uses initializeAuth()
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Launch Google OAuth (client IDs configured in app.json)
export async function signIn(): Promise<UserCredential> {
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "<your-ios-client-id>",
        androidClientId: "<your-android-client-id>",
        webClientId: "<your-web-client-id>",
    });

    return new Promise((resolve, reject) => {
        if (!request) reject("GoogleAuth request not ready");

        // Launch popup
        promptAsync()
            .then(async (res) => {
                if (res?.type !== "success" || !res.authentication) {
                    return reject("Authentication failed");
                }

                // Convert Google token → Firebase credential
                const credential = GoogleAuthProvider.credential(
                    null,
                    res.authentication.accessToken
                );

                const firebaseUser = await signInWithCredential(auth, credential);
                resolve(firebaseUser);
            })
            .catch(reject);
    });
}
