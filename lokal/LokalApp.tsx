import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from 'expo-linking';
import { StatusBar } from "react-native";
import { LokalFetchingState, LokalText } from "./common/LokalCommons";
import { LokalsOnlineBar } from "./common/LokalsOnlineBar";
import { BackgammonScreen } from "./game/backgammon/BackgammonScreen";
import { BatakScreen } from "./game/batak/BatakScreen";
import { Pishti2Screen } from "./game/pishti/PishtiScreen";
import { CurrentPlayerProvider } from "./player/CurrentPlayer";
import LokalScreen from "./screens/LokalScreen";
import { RegistrationScreen } from "./screens/RegistrationScreen";

const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator();

export const LokalApp = () => {

    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                intro: 'intro',
                lokal: 'lokal',
                kayit: 'kayit',
                tavla: 'tavla/:sessionId?',
                pishti: 'pishti/:sessionId?',
                batak: 'batak/:sessionId?',
            },
        },        
    };

    return <>
        <StatusBar />
        <CurrentPlayerProvider>
            <NavigationContainer 
                linking={linking} 
                fallback={<LokalFetchingState />}
                theme={{dark: true, colors: {background: 'transparent', text: '#fff'}} as Theme}
            >
                <Stack.Navigator 
                    initialRouteName='lokal'
                    screenOptions={{
                        headerTitle: (props) => <LokalsOnlineBar /> ,
                        headerStyle: {backgroundColor: 'transparent'},
                        headerTitleStyle: {fontWeight: 'bold'},
                        headerTitleAlign: 'center'
                    }
                }>
                    <Stack.Screen name="tavla" component={BackgammonScreen} />
                    <Stack.Screen name="batak" component={BatakScreen} />
                    <Stack.Screen name="pishti" component={Pishti2Screen} />
                    <Stack.Screen name="lokal" component={LokalScreen} />
                    <Stack.Screen name="kayit" component={RegistrationScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </CurrentPlayerProvider>
    </>
}