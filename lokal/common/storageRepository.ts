import AsyncStorage from "@react-native-async-storage/async-storage";
import {KeyValuePair} from "@react-native-async-storage/async-storage/lib/typescript/types";

export const storageRepository = {
    saveValueFor: async (key: string, value: string) => {
        AsyncStorage
            .setItem(key, value)
            .then(() => console.debug(`key: ${key} value: ${value}`));
    },

    getValueFor: async (key: string): Promise<string> => {
        return AsyncStorage.getItem(key)
    },

    getAllValues: async (keys: string[]): Promise<readonly KeyValuePair[]> => {
        return AsyncStorage.multiGet(keys)
    },

    removeValue: (key: string) => {
        AsyncStorage.removeItem(key);
    },

    removeValues: (keys: string[]) => {
        AsyncStorage.multiRemove(keys);
    }
}