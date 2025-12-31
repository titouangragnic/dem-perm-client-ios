import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getInStoreUsageOfRealData() : Promise<string> {
    return await AsyncStorage.getItem("usingRealData") ?? "false";
}