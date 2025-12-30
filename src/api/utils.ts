import * as SecureStore from "expo-secure-store";

export async function getInStoreUsageOfRealData() : Promise<string> {
    return await SecureStore.getItemAsync("usingRealData") ?? "false";
}