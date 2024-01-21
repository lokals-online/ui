import { Pressable, StyleSheet, View } from "react-native";
import { LokalSquare } from "../common/LokalCommons";
import { LOKAL_COLORS } from "../common/LokalConstants";
import { usePlayer } from "../player/CurrentPlayer";

interface ChirakProps {
    sayHello: () => void;
};
const ChirakComponent = ({sayHello}: ChirakProps) => {
    const {player} = usePlayer();

    return (
        <View style={[cirakStyle.cirak]}>
            <Pressable onPress={() => console.log("hello")}>
                <LokalSquare style={{fontSize: 30, color: LOKAL_COLORS.ONLINE_FADED}} />
                {/* <Feather style={cirakStyle.avatar} name={'user'} color={'white'} size={30} /> */}
            </Pressable>
        </View>
    )

}

export default ChirakComponent;

const cirakStyle = StyleSheet.create({
    cirak: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {},
    neonTextEffect: {
        color: 'white', 
        textShadowColor: 'white',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10
    },
});