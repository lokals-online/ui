import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LokalText } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import Animated from 'react-native-reanimated';

export const ClosedCard = () => {
    return <View style={[cardStyle.card, {
        borderWidth: 3, 
        borderColor: LOKAL_COLORS.ONLINE_FADED, 
        backgroundColor: 'transparent',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }]}>
        <LokalText style={{fontSize: 8, color: 'white'}}>LOKALS</LokalText>
        {/* <LokalSquare style={{fontSize: 8, color: LOKAL_COLORS.ONLINE}} /> */}
        <LokalText style={{fontSize: 8, color: LOKAL_COLORS.ONLINE_FADED}}>ONLINE</LokalText>
    </View>
};

export const CardComponent = ({style, number, type, disabled, onPress}: any) => {

    const color = (type === 'DIAMONDS' || type === 'HEARTS') ? LOKAL_COLORS.CARD_RED : LOKAL_COLORS.CARD_BLACK;
    const fontSize = 15;
    const cardNumberFormatted = useMemo(() => {
        if (number === 11) return 'J';
        else if (number === 12) return 'Q';
        else if (number === 13) return 'K';
        else if (number === 14) return 'A';
        else return number;
    }, [number]);

    const symbol = useMemo(() => {
        switch (type) {
            case 'SPADES': return <MaterialCommunityIcons name="cards-spade" size={fontSize} color={color} />
            case 'CLUBS': return <MaterialCommunityIcons name="cards-club" size={fontSize} color={color} />
            case 'HEARTS': return <MaterialCommunityIcons name="cards-heart" size={fontSize} color={color} />
            case 'DIAMONDS': return <MaterialCommunityIcons name="cards-diamond" size={fontSize} color={color} />
            default: return <Text style={{color: 'black'}}>&#9632;</Text>
        }
    }, [type]);

    return <Pressable 
        disabled={disabled}
        onPress={onPress}
        style={[cardStyle.card, style]}
    >
        <View style={cardStyle.cardNumber}>
            <LokalText style={{color: color, fontSize: fontSize}}>{cardNumberFormatted}</LokalText>
            {symbol}
        </View>
    </Pressable>

}

export const CardAnimation = () => {

    const numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    const types = ['SPADES','CLUBS','HEARTS','DIAMONDS'];

    const [numberIndex, setNumberIndex] = useState<number>();
    const [typeIndex, setTypeIndex] = useState<number>();

    useEffect(() => {
        const int = setInterval(() => {
            const ms = new Date().getMilliseconds();
            const numberIndex = ms % 14;
            const typeIndex = ms % 4;
            setTypeIndex(typeIndex);
            setNumberIndex(numberIndex);
        }, 100);

        return () => clearInterval(int);
    });

    return <CardComponent number={numbers[numberIndex]} type={types[typeIndex]} disabled={true} onPress={() => {}} />
}

const cardStyle = StyleSheet.create({
    card: {
        height: '100%',
        width: 'auto',
        aspectRatio: 1/1.5,
        backgroundColor: 'white',
    },
    cardNumber: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        // backgroundColor: '#ee3',
    }
});


// ♠	9824	2660	BLACK SPADE SUIT
// ♣	9827	2663	BLACK CLUB SUIT
// ♥	9829	2665	BLACK HEART SUIT
// ♦	9830	2666	BLACK DIAMOND SUIT
// ♡	9825	2661	WHITE HEART SUIT
// ♢	9826	2662	WHITE DIAMOND SUIT
// ♤	9828	2664	WHITE SPADE SUIT
// ♧	9831	2667	WHITE CLUB SUIT