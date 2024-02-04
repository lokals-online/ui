import { BlurView } from "expo-blur";
import * as Linking from "expo-linking";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, SlideInUp, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";
import { LokalText, LokalTextBlink } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { TableQr } from "../../masa/TableQr";
import { usePlayer } from "../../player/CurrentPlayer";
import { Card } from "../card/Card";
import { CardAnimation, CardComponent, ClosedCard } from "./Card";
import { PishtiFormComponent } from "./PishtiFormComponent";
import { usePishti } from "./PishtiProvider";
import { usePishtiSession } from "./PishtiSessionProvider";

interface CardPlayedEvent {
    playerId: string;
    card: Card;
}
interface TurnChangedEvent {
    playerId: string;
}
interface PishtiEvent {
    playerId: string;
}
interface CaptureEvent {
    playerId: string;
}

const PISHTI_TURN_INTERVAL = 500;
const PishtiComponent = () => {

    const {player, socketClient} = usePlayer();
    const {session} = usePishtiSession();
    const {pishti} = usePishti();

    const status = useMemo<string>(() => session?.status, [pishti, session]);
    
    const [hand, setHand] = useState<Array<Card>>([]);
    const handRef = useRef<Array<Card>>(hand);
    
    const [opponentHand, setOpponentHand] = useState<number>();
    const opponentHandRef = useRef<number>();
    
    const [stack, setStack] = useState<Array<Card>>(pishti?.stack || []);
    const stackRef = useRef(stack);
    
    const [turn, setTurn] = useState<string>();

    const isCurrentPlayerTurn = useMemo<boolean>(() => turn === player?.id, [player, pishti, turn]);
    const [playing, setPlaying] = useState<boolean>(false);
    const [newRound, setNewRound] = useState<boolean>(false);

    useEffect(() => {

        if (!pishti?.id || !socketClient) return;

        setStack(pishti?.stack);
        setHand(pishti?.hand);
        setOpponentHand(pishti?.opponent.hand);
        setTurn(pishti?.turn);

        if (pishti?.remainingCardCount === 40) {
            setNewRound(true);
            setTimeout(() => {
                setNewRound(false);
            }, 2000);
        }

        const newRoundSubscription = socketClient?.subscribe(`/topic/game/pishti/${pishti.id}/newRound`, (message: any) => {
            console.log("new Round:");
        });

        const playedCardSubscription = socketClient?.subscribe(`/topic/game/pishti/${pishti.id}/cardPlayed`, (message: any) => {
            const cardPlayedEvent = JSON.parse(message.body) as CardPlayedEvent;
            console.log("card played:", cardPlayedEvent);
            if (cardPlayedEvent.playerId === pishti?.opponent.id) {
                console.log("reducing opponent hand...")
                setOpponentHand(opponentHandRef.current-1);
            }
            setStack([...stackRef.current, cardPlayedEvent.card]);
        });
        const turnSubscription = socketClient?.subscribe(`/topic/game/pishti/${pishti.id}/turnChanged`, (message: any) => {
            const turnChangedEvent = JSON.parse(message.body) as TurnChangedEvent;
            
            setTurn(turnChangedEvent.playerId);
        });
        const pishtiSubscription = socketClient?.subscribe(`/topic/game/pishti/${pishti.id}/pishti`, (message: any) => {
            const pishtiEvent = JSON.parse(message.body);
            console.log(pishtiEvent.playerId + " MADE PISHTI!!!");
            setStack([]);
        });
        const captureSubscription = socketClient?.subscribe(`/topic/game/pishti/${pishti.id}/captured`, (message: any) => {
            const captureEvent = JSON.parse(message.body);
            console.log(captureEvent.playerId + " CAPTURED!!!");
            setStack([]);
        });

        return () => {
            newRoundSubscription.unsubscribe();
            playedCardSubscription.unsubscribe();
            turnSubscription.unsubscribe();
            pishtiSubscription.unsubscribe();
            captureSubscription.unsubscribe();
        }
    }, [pishti, socketClient]);

    useEffect(() => {handRef.current = hand}, [hand]);
    useEffect(() => {opponentHandRef.current = opponentHand}, [opponentHand]);
    useEffect(() => {stackRef.current = stack}, [stack]);

    const playCard = (card: Card) => {
        setPlaying(true);
        // Remove the played card from the hand
        console.log("PLAYED CARD", card)
        const updatedHand = handRef.current.filter(c => c !== card);

        // Update the state and the ref
        setHand(updatedHand);
        handRef.current = updatedHand;

        pishtiApi.game
            .play(session?.id, pishti.id, card)
            .then(() => setPlaying(false));
    };

    useEffect(() => {
        console.log(`rendered ===> hand[${hand.length}], stack[${stack.length}]`);
    });

    if (status === 'INITIAL') {
        return <PishtiFormComponent />
    }
    else if (status === 'WAITING') {
        return <TableQr url={Linking.createURL(`/pishti/${session?.id}`)} />
    }
    else if (status === 'ENDED') {
        return <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            zIndex:100, width:'100%', height: '100%', position: 'absolute', top: 0, left:0
        }}>
            <LokalText>oyun bitti.</LokalText>
        </View>
    }
    else return (
        <View style={style.pishti}>
            {newRound && 
                <View style={[style.stack]}>
                    <View style={{height: '50%', aspectRatio: 1/1, overflow: 'hidden'}}>
                        <Animated.View  style={{
                            top: 0,
                            left: 0,
                            position: 'absolute',
                            height: '80%',
                            borderWidth: 1,
                            borderColor: '#444'
                        }}>
                            <CardAnimation />
                        </Animated.View>
                </View>
                </View>
            }
            {!newRound && <>
        
                {(pishti?.turn === 'ENDED') && 
                    <BlurView intensity={40} tint="dark" style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        zIndex:100, width:'100%', height: '100%', position: 'absolute', top: 0, left:0
                    }}>
                        <LokalText>yeni oyun başlıyor...</LokalText>
                    </BlurView>
                }

                {!isCurrentPlayerTurn && 
                    <LokalTextBlink intervalInMs={PISHTI_TURN_INTERVAL} 
                        style={{
                            position: 'absolute', 
                            top: -10,
                            left: 'center',
                            width: 50, 
                            heigth: 50, 
                            justifyContent: 'flex-end',
                            alignSelf: 'center',
                            borderBottomWidth: 10,
                            borderColor: LOKAL_COLORS.WARNING
                        }}>
                    </LokalTextBlink>
                }
                {/* CURRENT PLAYER INDICATOR LED! */}
                {isCurrentPlayerTurn && 
                    <LokalTextBlink intervalInMs={PISHTI_TURN_INTERVAL} 
                        style={{
                            position: 'absolute', 
                            bottom: -10, 
                            left: 'center',
                            width: 50, 
                            heigth: 50, 
                            justifyContent: 'flex-end',
                            alignSelf: 'center',
                            borderTopWidth: 10,
                            borderColor: LOKAL_COLORS.WARNING
                        }}>
                    </LokalTextBlink>
                }

                <View style={[style.opponent]}>
                    <View style={[style.opponentHand, ((pishti?.turn !== player.id) ? style.activeTurn : {})]}>
                        {Array.from({ length: opponentHand || 0 }, (_, i) => <ClosedCard key={`oppHand${i}`} />)}
                    </View>
                </View>

                <View style={[style.stack]}>
                    <View style={{height: '50%', aspectRatio: 1/1, overflow: 'hidden'}}>
                        {stack?.map((card: Card, i: number) => 
                            <Animated.View 
                                key={`stackCard${i}`} 
                                entering={SlideInUp.duration(500).easing(Easing.ease)}
                                style={{
                                    top: card.number,
                                    left: card.number,
                                    position: 'absolute',
                                    height: '80%',
                                    borderWidth: 1,
                                    borderColor: '#444'
                                }}
                            >
                                <CardComponent number={card.number} type={card.type} />
                            </Animated.View>
                        )}
                    </View>
                </View>
                
                <View style={[style.currentPlayer]}>
                    <View style={[style.currentPlayerHand, (isCurrentPlayerTurn ? style.activeTurn : {})]}>
                        {hand?.map((card: Card, i: number) => 
                            <Animated.View 
                                key={`playerHand${i}`} 
                                // entering={SlideInDown.duration(200).easing(Easing.inOut(Easing.exp))}
                                // exiting={SlideInUp.duration(200).easing(Easing.inOut(Easing.exp))}
                            >
                                <CardComponent 
                                    // key={`playerHand${i}`} 
                                    number={card.number} 
                                    type={card.type} 
                                    onPress={() => {if (isCurrentPlayerTurn && !playing) playCard(card)}}
                                />
                            </Animated.View>
                        )}
                    </View>
                </View>
            </>}
        </View>
    )
}

export default PishtiComponent;

const style = StyleSheet.create({
    pishti: {
        width: '100%',
        aspectRatio: 1,
        display: 'flex',
        flex:4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        // backgroundColor: '#eaa'
    },
    // ------------ OPPONENT
    opponent: {
        width: '100%',
        height: '25%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#c0baba'
    },
    opponentHand: {
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        width: '25%',
    },
    // ------------ STACK
    stack: {
        width: '100%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#e13',
        // borderWidth: 5,
        // borderColor: '#000'
    },
    // ------------ CURRENT PLAYER
    currentPlayer: {
        flex: 1,
        width: '100%',
        height: '25%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // backgroundColor: 'yellow',
    },
    currentPlayerHand: {
        display: 'flex',
        height: '100%',
        width: '50%',
        columnGap: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        // backgroundColor: '#bb4',
    },
    activeTurn: {
        // backgroundColor: '#fafafa67',
        // shadowColor: '#734b4b',
        // shadowOffset: {width: -1, height: 1},
        // shadowOpacity: 0.7,
        // shadowRadius: 20
    }
})