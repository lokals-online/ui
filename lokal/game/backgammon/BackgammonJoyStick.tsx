import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { LokalModal, LokalText, LokalTextBlink } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { backgammonApi } from "../../chirak/chirakApi/game/backgammonApi";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import { useEffect, useMemo, useState } from "react";
import LokalTextPrompt from "../../common/LokalTextPrompt";
import { BlurView } from "expo-blur";
import { useBackgammon } from "./BackgammonProvider";
import { useNavigation } from "@react-navigation/native";
import { CHIRAK_PLAYER } from "../../player/Player";
import { BasKonus, PlaySound } from "../../common/BasKonus";

export const BackgammonJoystick = ({toggleQr}) => {

    const navigation = useNavigation();
    
    const {player} = usePlayer();

    const {session, quitSession} = useBackgammonSession();

    const [quitSessionModal, setQuitSessionModal] = useState<boolean>(false);

    return (
        <View style={joystickStyles.box}>
            <View style={{width: '100%', flexDirection: 'row', flex:3}}>
                <View style={joystickStyles.joyStickButton}>
                    {session && (session?.status !== 'INITIAL' && session?.status !== 'STARTED') && 
                        <Pressable onPress={toggleQr}>
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color={LOKAL_COLORS.OFFLINE} />
                        </Pressable>
                    }
                    {session && session?.status === 'STARTED' && 
                        <Pressable onPress={() => navigation.navigate('tavla', {sessionId: session?.id})}>
                            <MaterialCommunityIcons name="refresh" size={40} color={LOKAL_COLORS.OFFLINE} />
                        </Pressable>
                    }
                </View>
                <View style={[joystickStyles.joyStickButton, {justifyContent: 'center',alignItems: 'center'}]}>
                    {session?.status !== 'STARTED' && <SessionButton />}
                    {session?.status === 'STARTED' && <GameButton />}
                </View>
                <View style={joystickStyles.joyStickButton}>
                    {session && session?.status !== 'INITIAL' && 
                        <Pressable onPress={() => setQuitSessionModal(!quitSessionModal)}>
                            <LokalText style={{color: LOKAL_COLORS.OFFLINE, fontSize: 40}}>X</LokalText>
                        </Pressable>
                    }
                    <LokalModal visible={quitSessionModal} title={'Oyun kapatılsın mı?'} 
                        accept={quitSession} 
                        decline={() => setQuitSessionModal(!quitSessionModal)}
                    />
                </View>
            </View>
        </View>
    );
}
const GameButton = () => {
    const {player} = usePlayer();
    const {session} = useBackgammonSession();
    const {id, turn} = useBackgammon();

    const isOwner = useMemo<boolean>(() => session?.home?.id === player.id, [player, session]);

    const [disabled, setDisabled] = useState<boolean>(false);

    return <>
        {turn?.playerId === player.id && !turn?.dices &&
            <Nipple text={'zar at'} 
                disabled={disabled}
                onPress={() => {
                    setDisabled(true);
                    backgammonApi.game
                        .rollDice(session.id, id)
                        .then(() => setDisabled(false));
                }}></Nipple>
        }
        {/* {turn?.playerId !== player.id && <BasKonus />} */}
    </>
}
const SessionButton = () => {

    const {player} = usePlayer();
    const {session, reloadSession, newSession} = useBackgammonSession();

    const isOwner = useMemo<boolean>(() => session?.home?.id === player.id, [player, session]);
    
    const [disabled, setDisabled] = useState<boolean>(false);

    return (
        <>
            {isOwner && <>
                {session?.status === 'INITIAL' && 
                    <Nipple onPress={() => newSession()} text={'başla'} />
                }
                {session?.status === 'WAITING' && (!session?.home?.firstDie) &&
                    <Nipple onPress={() => 
                        backgammonApi.session
                            .rollFirstDie(session.id)
                            .then(res => {
                                console.log(res);
                                reloadSession();
                            })
                        }
                        text={'zar at'}
                    >
                    </Nipple>
                }
            </>}

            {!isOwner && <>
                {session?.status === 'WAITING_OPPONENT' && (!session?.away || (session?.away?.id === CHIRAK_PLAYER.id)) && 
                    <Nipple onPress={() => backgammonApi.session.sit(session.id)} text={'otur'} />
                }
                {session?.status === 'WAITING' && (!session?.away?.firstDie) && (session?.away?.id === player.id) &&
                    <Nipple disabled={disabled} onPress={
                        () => {
                            setDisabled(true);
                            backgammonApi.session.rollFirstDie(session.id);
                        }
                    } text={'zar at'} />
                }
            </>}
        </>
    )
}

export const Nipple = ({onPress, disabled, text}: any) => {
    return <Pressable style={{flexDirection: 'row', alignItems: 'center'}} disabled={disabled} onPress={onPress}>
        <LokalTextPrompt text={'['} style={{fontSize: 40}}></LokalTextPrompt>
        <LokalTextPrompt text={text} style={{fontSize: 24}}></LokalTextPrompt>
        <LokalTextPrompt text={']'} style={{fontSize: 40}}></LokalTextPrompt>
    </Pressable>
}

export const joystickStyles = StyleSheet.create({
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
        borderWidth: 5,
        borderRadius: 100
    }
});

export default BackgammonJoystick;
// const SUGGESTION_DELAY = 200;
// const UserSuggestionComponent = ({suggestion, index}: any) => {
    
//     const opacity = useSharedValue(0);

//     useEffect(() => {
//         opacity.value = withDelay(index * SUGGESTION_DELAY, withTiming(1, { duration: 1000 }));

//         return () => {opacity.value = withDelay(index * SUGGESTION_DELAY, withTiming(0, { duration: 1000 }))};
//     }, []);

//     return <Animated.View style={{opacity: opacity}}>
//         <Pressable key={`prompt[${index}]`} onPress={() => suggestion.value()}>
//             <LokalText style={{color: 'white'}}>{suggestion.key}</LokalText>
//         </Pressable>
//     </Animated.View>
// }