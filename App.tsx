import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from "expo-font";
import * as Linking from 'expo-linking';
import React, { useEffect, useMemo, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import applyGlobalPolyfills from "./globalPolyfills";
import { LokalText } from './lokal/common/LokalCommons';
import { DEVICE_RATIO, INNER_WIDTH, LOKAL_COLORS } from './lokal/common/LokalConstants';
import { LokalsOnlineBar } from "./lokal/common/LokalsOnlineBar";
import { BatakScreen } from './lokal/game/batak/BatakScreen';
import { Pishti2Screen } from './lokal/game/pishti/PishtiScreen';
import { CurrentPlayerProvider } from "./lokal/player/CurrentPlayer";
import { BackgammonScreen } from "./lokal/game/backgammon/BackgammonScreen";
import LokalScreen from "./lokal/screens/LokalScreen";
import { LokalsOnlineIntro } from './lokal/screens/Intro';
import { LokalApp } from './lokal/LokalApp';

// workaround for the TextEncoder issue with stompjs.
applyGlobalPolyfills();

export default function App() {

    const [fontLoaded] = useFonts({EuropeanTeletext: require('./assets/fonts/EuropeanTeletext.ttf')});
    const [animated, setAnimated] = useState(false);

    const ready = useMemo<boolean>(() => (fontLoaded && animated), [fontLoaded, animated]);

    useEffect(() => {
        setTimeout(() => {
            setAnimated(true);
        }, 2000);
    }, [fontLoaded]);

    return (
        <View style={styles.container}>
            <View style={[{
                height: '100%', 
                width: INNER_WIDTH, 
                // aspectRatio: DEVICE_RATIO,
            }, styles.innerCalculated]}>
                {ready && <LokalApp />}
                {!ready && <LokalsOnlineIntro initialized={fontLoaded} />}
            </View>
        </View>
    )
}

// serviceWorkerRegistration.register();

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    innerCalculated: {
        display: 'flex',
        shadowColor: LOKAL_COLORS.ONLINE_FADED,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 1.53,
        shadowRadius: 13.97,
        
        elevation: 21,
    }
});