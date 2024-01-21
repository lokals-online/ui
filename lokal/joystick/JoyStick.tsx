import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { LokalText } from "../common/LokalCommons";
import { LOKAL_COLORS } from "../common/LokalConstants";

export interface JoyStickContextProps {
    prompt: string,
    setPrompt: (value: string) => void;
}
export const JoyStickContext = createContext<JoyStickContextProps>({} as JoyStickContextProps);

export const JoyStickComponent = () => {

    const [pressed, setPressed] = useState<boolean>(false);

    return (
        <View style={styles.box}>
            <View style={{width: '100%', flexDirection: 'row', flex:3}}>
                <View style={styles.joyStickButton}>
                </View>
                <View style={[styles.joyStickButton, {justifyContent: 'center',alignItems: 'center'}]}>
                    <View style={[styles.redDot, {
                        // backgroundColor: prompt ? '#ee141445' : '#3e3c3c',
                        // borderColor: prompt ? LOKAL_COLORS.NOT_AVAILABLE : LOKAL_COLORS.OFFLINE
                    }]}>
                        <Pressable 
                            disabled={pressed}
                            onPress={() => console.log("hello nipple!")}
                            style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}
                        >
                            <MaterialCommunityIcons name='circle-outline' size={50} color={LOKAL_COLORS.OFFLINE} />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.joyStickButton}>
                    {/* <Pressable onPress={() => setChannel('#çırak')}>
                        <LokalText style={{color: LOKAL_COLORS.OFFLINE}}>#vazgeç</LokalText>
                    </Pressable> */}
                </View>
            </View>
        </View>
    );
}

const SUGGESTION_DELAY = 200;
const UserSuggestionComponent = ({suggestion, index}: any) => {
    
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(index * SUGGESTION_DELAY, withTiming(1, { duration: 1000 }));

        return () => {opacity.value = withDelay(index * SUGGESTION_DELAY, withTiming(0, { duration: 1000 }))};
    }, []);

    return <Animated.View style={{opacity: opacity}}>
        <Pressable key={`prompt[${index}]`} onPress={() => suggestion.value()}>
            <LokalText style={{color: 'white'}}>{suggestion.key}</LokalText>
        </Pressable>
    </Animated.View>
}

const styles = StyleSheet.create({
    box: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    display: {
        flexDirection: 'row',
        width: '100%', 
        height: 'auto', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    actions: {
        width: '100%',
        display: 'flex',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20
        // borderWidth: 1,
        // backgroundColor: '#ee8',
        // columnGap: 10,
        // marginTop: 10
    },
    joyStickButton: {
        flex: 1,
        // backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    redDot: {
        width: 'auto',
        height: '30%',
        aspectRatio: 1,
        // borderWidth: 5,
        // borderRadius: 100
    }
});

export default JoyStickComponent;