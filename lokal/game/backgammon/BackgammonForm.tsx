import { Pressable, StyleSheet, View } from "react-native"
import { LokalText } from "../../common/LokalCommons"
import { useBackgammonSession } from "./BackgammonSessionProvider";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { createContext, useContext, useEffect, useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { CHIRAK_PLAYER, Player } from "../../player/Player";

export interface OnlinePlayerContextProps {
    lokal: string;
    onlinePlayers: Array<Player>;
}
const OnlinePlayerContext = createContext<OnlinePlayerContextProps>({lokal: 'lokal', onlinePlayers: []} as OnlinePlayerContextProps);
export const useOnlinePlayers = () => {
    return useContext(OnlinePlayerContext);
}

export const BackgammonFormComponent = () => {
    const {session, updateSessionSettings, opponent, setOpponent} = useBackgammonSession();

    const {onlinePlayers} = useOnlinePlayers();

    const raceToAnimationProgress = useSharedValue(1);
    const onlinePlayerCheckIconStyle = useAnimatedStyle(() => {
        return {
            opacity: raceToAnimationProgress.value,
            color: (onlinePlayers && onlinePlayers?.length) ? LOKAL_COLORS.ONLINE_FADED : LOKAL_COLORS.OFFLINE
        }
    });

    useEffect(() => {
        if (onlinePlayers && onlinePlayers.length) {
            raceToAnimationProgress.value = withRepeat(withTiming(0.6, {duration: 1000}), -1, true);    
        }
    }, [onlinePlayers]);

    return <View style={{height: '100%', width: '100%', justifyContent: 'space-around', padding: 20}}>
        <View style={{width: '100%', height: '50%', justifyContent: 'space-evenly'}}>
            <View style={{width: '100%'}}><LokalText>Kaçta biter?</LokalText></View>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                {Array.from({ length: 5}, (_, index) =>
                    <Pressable 
                        key={`${index}-raceTo`} 
                        // style={{borderWidth: 1, borderColor: 'red'}}
                        onPress={() => updateSessionSettings({raceTo: index+1})}>
                            <LokalText style={(session?.settings?.raceTo == (index+1)) ? 
                                lokalFormStyle.raceToItemSelected : lokalFormStyle.raceToItem
                            }>{index+1}</LokalText>
                        </Pressable>
                    )
                }
            </View>
        </View>
        <View style={{width: '100%', height: '50%', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <View style={{width: '100%'}}><LokalText>rakip: </LokalText></View>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                {[CHIRAK_PLAYER, {id: "QR", username: "QR"}].map((opp: any) => 
                    <Pressable 
                        key={`opponent-${opp.id}`} 
                        onPress={() => setOpponent(opp.id)}>
                        <LokalText style={(opponent === opp.id) ? 
                                lokalFormStyle.opponentItemSelected : lokalFormStyle.opponentItem
                            }>{opp.username}</LokalText>
                    </Pressable>
                )}
                {/* <Pressable 
                    key={`opponent-lokal`} 
                    disabled={true}
                    onPress={() => console.log("lokal is not available")}>
                    <LokalText style={backgammonFormStyle.opponentItem}>
                        <Animated.View style={onlinePlayerCheckIconStyle}>
                            {'@'}
                        </Animated.View>
                        lokal</LokalText>
                </Pressable> */}
            </View>
        </View>
    </View>

}

export const lokalFormStyle = StyleSheet.create({
    raceToItem: {fontSize: 40, color: LOKAL_COLORS.ONLINE_FADED},
    raceToItemSelected: {fontSize: 40, color: LOKAL_COLORS.WHITE},
    opponentItem: {fontSize: 24, color: LOKAL_COLORS.ONLINE_FADED},
    opponentItemSelected: {fontSize: 40, color: LOKAL_COLORS.WHITE},
    opponentLokal: {fontSize: 24, color: LOKAL_COLORS.OFFLINE}
});