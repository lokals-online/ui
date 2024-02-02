import { useFonts } from "expo-font";
import React, { useEffect, useMemo, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import applyGlobalPolyfills from "./globalPolyfills";
import { LokalApp } from './lokal/LokalApp';
import { INNER_WIDTH, LOKAL_COLORS } from './lokal/common/LokalConstants';
import { LokalsOnlineIntro } from './lokal/screens/Intro';
import { CurrentPlayerProvider } from "./lokal/player/CurrentPlayer";

// workaround for the TextEncoder issue with stompjs.
applyGlobalPolyfills();

export default function App() {

    const [fontLoaded] = useFonts({EuropeanTeletext: require('./assets/fonts/EuropeanTeletext.ttf')});

    return (
        <View style={styles.container}>
            <View style={[{
                height: '100%', 
                width: INNER_WIDTH, 
                // aspectRatio: DEVICE_RATIO,
            }, styles.innerCalculated]}>
                <StatusBar />
                <CurrentPlayerProvider isReady={fontLoaded}>
                    <LokalApp />
                </CurrentPlayerProvider>
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