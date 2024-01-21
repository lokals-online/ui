import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from "expo-font";
import * as Linking from 'expo-linking';
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import applyGlobalPolyfills from "./globalPolyfills";
import { LokalText } from './lokal/common/LokalCommons';
import { DEVICE_RATIO, INNER_WIDTH, LOKAL_COLORS } from './lokal/common/LokalConstants';
import { LokalsOnlineBar } from "./lokal/common/LokalsOnlineBar";
import { BatakScreen } from './lokal/game/batak/BatakScreen';
import { Pishti2Screen } from './lokal/game/pishti/PishtiScreen';
import { CurrentPlayerProvider } from "./lokal/player/CurrentPlayer";
import { BackgammonScreen } from "./lokal/game/backgammon/BackgammonScreen";
import LokalComponent from "./lokal/screens/Lokal";

// workaround for the TextEncoder issue with stompjs.
applyGlobalPolyfills();

const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator();

export default function App() {
    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                test: 'test',
                lokal: 'lokal',
                tavla: 'tavla/:sessionId?',
                pishti: 'pishti/:sessionId?',
                batak: 'batak/:sessionId?',
            },
        },        
    };

    const [fontLoaded] = useFonts({EuropeanTeletext: require('./assets/fonts/EuropeanTeletext.ttf')});

    return (fontLoaded && 
        <View style={styles.container}>
            <View style={[{
                height: '100%', 
                width: INNER_WIDTH, 
                aspectRatio: DEVICE_RATIO,
            }, styles.innerCalculated]}>
                <StatusBar />
                <CurrentPlayerProvider>
                    <NavigationContainer 
                        linking={linking} 
                        fallback={<LokalText>Loading...</LokalText>}
                        theme={{dark: true, colors: {background: 'transparent', text: '#fff'}} as Theme}
                    >
                        <Stack.Navigator 
                            initialRouteName='test'
                            screenOptions={{
                                headerTitle: (props) => <LokalsOnlineBar /> ,
                                headerStyle: {
                                    backgroundColor: 'transparent',
                                },
                                headerTitleStyle: {fontWeight: 'bold'},
                                headerTitleAlign: 'center'
                            }
                        }>
                            <Stack.Screen name="lokal" component={LokalComponent} />
                            <Stack.Screen name="tavla" component={BackgammonScreen} />
                            <Stack.Screen name="batak" component={BatakScreen} />
                            <Stack.Screen name="pishti" component={Pishti2Screen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </CurrentPlayerProvider>
            </View>
        </View>
    );
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