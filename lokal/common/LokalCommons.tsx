import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { LOKAL_COLORS, LOKAL_DEFAULT_FONT_SIZE } from "./LokalConstants";
import { BlurView } from 'expo-blur';

export const LokalLoadingComponent = ({}: any) => {

    return <View>
        <LokalText>Bekliyoruz...</LokalText>
    </View>

}

export const LokalText = ({children, style, numberOfLines}: any) => {
    return (<Text numberOfLines={numberOfLines} style={[{fontFamily: 'EuropeanTeletext', fontSize: LOKAL_DEFAULT_FONT_SIZE, color: LOKAL_COLORS.WHITE}, style]}>{children}</Text>);
};

export const LokalTextBlink = ({intervalInMs, children, style}: any) => {
    const progress = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {opacity: progress.value}
    });

    useEffect(() => {
        progress.value = withRepeat(withTiming(0.5, {duration: intervalInMs}), -1, true);
    }, []);

    return (
        <Animated.View style={[style, animatedStyle]}>
            <LokalText>{children}</LokalText>
        </Animated.View>
    );
};

export const LokalFetchingState = () => <LokalTextBlink intervalInMs={200}>
    <LokalSquare />
</LokalTextBlink>

interface LokalSelectOption {
    key: string;
    value: string;
    selected: boolean;
}
export interface LokalSelectProps {
    options: Array<LokalSelectOption>;
    onSelect: (key: string) => string;
}

export const LokalSelect = ({options, onSelect}: LokalSelectProps) => {

    return (<View>
        {options.map((option, index) => {
            return <Pressable>
                <LokalText>#{option.value}</LokalText>
            </Pressable>
        })}
    </View>);

}

export interface LokalModalProps {
    visible: boolean;
    title: any;
    accept: () => void;
    decline: () => void;
}
export const LokalModal = ({visible, title, accept, decline}: LokalModalProps) => {
    return <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={decline}
    >
        <BlurView tint={'dark'} intensity={60} style={{
            flex: 1, width: '100%', height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <LokalText style={{fontSize: 50,margin: 40}}>{title}</LokalText>
            <View style={{flexDirection: 'row'}}>
                <Pressable onPress={accept}>
                    <LokalText style={{fontSize: 30, color: LOKAL_COLORS.ACCEPT}}>[evet]</LokalText>
                </Pressable>
                <Pressable onPress={decline}>
                    <LokalText style={{fontSize: 30, color: LOKAL_COLORS.DECLINE}}>[hayır]</LokalText>
                </Pressable>
            </View>
        </BlurView>
    </Modal>
}

export const LokalSquare = ({style, children}: any) => 
    <View style={[{
        width: 20,
        aspectRatio: 1/1,
        borderWidth: 0, 
        borderRadius: 3, 
        backgroundColor: LOKAL_COLORS.ONLINE, 
        borderColor: LOKAL_COLORS.ONLINE, 
        color: LOKAL_COLORS.ONLINE
    }, style]}>
        {children}
    </View>;

export const LokalSquareAnimated = ({size, style}: any) => {

    const sv = useSharedValue(size);

    useEffect(() => {
        sv.value = withRepeat(withTiming(size+2, {duration: 100}), -1, true);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({ width: sv.value, height: sv.value }));
    
    return <Animated.View style={[{
        aspectRatio: 1/1,
        borderRadius: 3, 
    }, style, animatedStyle]}>

    </Animated.View>;
}

export const LokalSuit = ({type, size, color}:any) => {
    switch (type) {
        case 'SPADES': return <MaterialCommunityIcons name="cards-spade" size={size} color={color} />
        case 'CLUBS': return <MaterialCommunityIcons name="cards-club" size={size} color={color} />
        case 'HEARTS': return <MaterialCommunityIcons name="cards-heart" size={size} color={color} />
        case 'DIAMONDS': return <MaterialCommunityIcons name="cards-diamond" size={size} color={color} />
        default: return '' //<LokalText style={{color: 'black'}}>&#9632;</LokalText>
    }
}
export const LokalSpade = ({size, color}:any) => <MaterialCommunityIcons name="cards-spade" size={size} color={color || LOKAL_COLORS.WHITE} />
export const LokalClub = ({size, color}:any) => <MaterialCommunityIcons name="cards-club" size={size} color={color || LOKAL_COLORS.WHITE} />
export const LokalHeart = ({size, color}:any) => <MaterialCommunityIcons name="cards-heart" size={size} color={color || LOKAL_COLORS.WHITE} />
export const LokalDiamond = ({size, color}:any) => <MaterialCommunityIcons name="cards-diamond" size={size} color={color || LOKAL_COLORS.WHITE} />