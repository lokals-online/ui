import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { usePlayer } from "../player/CurrentPlayer";
import { LokalText } from "./LokalCommons";
import { LOKAL_COLORS, LOKAL_DEFAULT_FONT_SIZE, LOKAL_STATUS } from "./LokalConstants";

export const LokalsOnlineBar = () => {

    const {status, changeStatus} = usePlayer();

    const barContainerProgress = useSharedValue(0);
    const barContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: barContainerProgress.value,
          };
    });

    useEffect(() => {
        barContainerProgress.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    }, []);

    const toggleStatus = () => changeStatus(status === LOKAL_STATUS.ONLINE ? LOKAL_STATUS.OFFLINE : LOKAL_STATUS.ONLINE);

    return (
        <Animated.View style={[{flexDirection: 'row',justifyContent: 'center'}, barContainerStyle]}>
            <LokalText>LOKALS</LokalText>
            <LokalText style={{marginLeft: 2, marginRight: 2, color: status === LOKAL_STATUS.ONLINE ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}}>&#9632;</LokalText>
            <Pressable onPress={toggleStatus}><LokalText style={{color: status === LOKAL_STATUS.ONLINE ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}}>{status}</LokalText></Pressable>
        </Animated.View>
    )
}

const style = StyleSheet.create({
    lokalBarItem: {
        flexBasis: 200, 
        display: 'flex',
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: '#eef', 
        fontSize: LOKAL_DEFAULT_FONT_SIZE, 
        color: LOKAL_COLORS.ONLINE_FADED,
    },
    mainMenuItem: {
        fontSize: 40,
        margin: 40,
    }
});