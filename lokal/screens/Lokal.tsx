import { useHeaderHeight } from '@react-navigation/elements';
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { DEVICE_DIMENSIONS, LOKAL_COLORS, LOKAL_GAMES, LOKAL_STATUS } from "../common/LokalConstants";
import JoyStickComponent from '../joystick/JoyStick';
import { usePlayer } from "../player/CurrentPlayer";
import { LokalText } from '../common/LokalCommons';

export interface Lokal {
    id: string;
    name: string;
}

export interface MenuItem {
    value: string;
    count: number;
    // onSelect: () => void;
}
const DEFAULT_MENU = [
    { value: "#" + LOKAL_GAMES.BACKGAMMON.name, path: LOKAL_GAMES.BACKGAMMON.url, count: 10 },
    { value: "#" + LOKAL_GAMES.BATAK.name, path: LOKAL_GAMES.BATAK.url, count: 10 },
    { value: "#" + LOKAL_GAMES.PISHTI.name, path: LOKAL_GAMES.PISHTI.url, count: 10 },
    { value: '#lokal', count: 5 },
    { value: '#kayit', count: 5 },
    { value: '#çırak', count: 2 },
];

const LokalComponent = ({navigation}: any) => {

    const {player, status} = usePlayer();
    
    const headerHeight = useHeaderHeight();
    const lokalHeight = useMemo(() => DEVICE_DIMENSIONS.height - headerHeight, [headerHeight]);

    const tagColor = useMemo<string>(
        () => (LOKAL_STATUS.ONLINE === status) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE
    , [status]);
    
    const colorOptions = useMemo<{}>(() => 
        (LOKAL_STATUS.ONLINE === status) ? 
            {luminosity: 'dark', hue: LOKAL_COLORS.ONLINE} : 
            {luminosity: 'light', hue: 'monochrome'}
    , [status]);

    return ( 
        <View style={[style.lokal, {height: lokalHeight}]}>
            <View style={[style.yazihane, {
                height: lokalHeight/4,
                // borderWidth: 1, borderColor: '#ee0'
                // backgroundColor: '#ee0'
            }]}>
                {/* {status === LOKAL_STATUS.ONLINE && <YazihaneComponent />} */}
            </View>
            <View style={[style.masa, {
                height: (lokalHeight/2),
                borderWidth: 1, borderColor: 'pink'
                // backgroundColor: 'red'
            }]}>
                {DEFAULT_MENU.map((item) => 
                    <Pressable key={item.value} onPress={() => navigation.navigate(item.path)}>
                        <LokalText style={{fontSize: 42, color: tagColor}}>{item.value}</LokalText>
                    </Pressable>
                )}
                {/* <TagCloud 
                    style={{fontFamily: 'EuropeanTeletext'}}
                    shuffle={false}
                    minSize={13} maxSize={80} 
                    colorOptions={colorOptions}
                    onClick={(tag: {value: string, path?: string, count: number}) => navigation.navigate(tag.path)}
                    tags={DEFAULT_MENU} color={tagColor} 
                /> */}
            </View>
            <View style={[style.joystick, {
                // height: ((DEVICE_DIMENSIONS.height/4)-(headerHeight/2))
                height: (lokalHeight/4),
                // backgroundColor: '#ee0'
                // borderWidth: 5, borderColor: '#ee0'
            }]}>
                <JoyStickComponent />
            </View>
        </View>
    )
}
export default LokalComponent;

export const style = StyleSheet.create({
    lokal: {
        display: 'flex',
        flexDirection: 'column'
    },
    yazihane: {
        display: 'flex',
        width: '100%'
    },
    masa: {
        aspectRatio: 1/1,
        // height: '50%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        zIndex: 10,
        position: 'relative'
    },
    joystick: {
        display: 'flex',
        width: '100%',
        // height: '25%'
    }
});