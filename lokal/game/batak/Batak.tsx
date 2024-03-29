import * as Linking from "expo-linking";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { LokalClub, LokalDiamond, LokalHeart, LokalSpade, LokalSquare, LokalText, LokalTextBlink } from "../../common/LokalCommons";
import { INNER_WIDTH, LOKAL_COLORS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { CardComponent } from "../pishti/Card";
import { useBatak } from "./BatakProvider";
import { useBatakSession } from "./BatakSessionProvider";
import { BatakMove } from "./batakUtil";
import { Card } from "../card/Card";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { BatakFormComponent } from "./BatakFormComponent";
import { TableQr } from "../../masa/TableQr";

export const BatakComponent = () => {

    const {player} = usePlayer();
    const {sessionId, sessionStatus} = useBatakSession();
    const {
        batakId, hand, rightPlayer, leftPlayer, topPlayer, 
        availableCards, availableBids, trick, turn, status
    } = useBatak();
    
    const isCurrentPlayerTurn = useMemo<boolean>(() => turn === player?.id, [player, turn]);
    const [playing, setPlaying] = useState<boolean>(false);

    const playCard = (card: Card) => {
        console.log("playing card", card, turn);
        setPlaying(true);

        batakApi.game
            .play(sessionId, batakId, card)
            .then(() => setPlaying(false));
    };

    if (sessionStatus === 'INITIAL') {
        return <BatakFormComponent />
    }
    else if (sessionStatus === 'WAITING_PLAYERS') {
        return <TableQr url={Linking.createURL(`/batak/${sessionId}`)} />
    }
    else if (sessionStatus === 'ENDED') {
        return <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            zIndex:100, width:'100%', height: '100%', position: 'absolute', top: 0, left:0
        }}>
            <LokalText>oyun bitti.</LokalText>
        </View>
    }
    else return (
        <View style={{flex: 1, width: '100%', padding: 5}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}></View>
                <View style={style.topPlayer}>
                    <View style={{height: '60%', flexDirection: 'row'}}>
                        {topPlayer && <BatakPlayerComp batakPlayer={topPlayer} />}
                    </View>    
                </View>
                <View style={{flex: 1}}></View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={style.leftPlayer}>
                    {leftPlayer && <BatakPlayerComp batakPlayer={leftPlayer} />}
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                    {status === 'BIDDING' && turn === player.id && 
                        <BidSelection 
                            availableBids={availableBids} 
                            onSelect={(bidValue: number) => batakApi.game.bid(sessionId, batakId, bidValue)} 
                        />
                    }
                    {status === 'WAITING_TRUMP' && turn === player.id && 
                        <BidTypeSelection onSelect={(cardSuit: string) => batakApi.game.chooseBetType(sessionId, batakId, cardSuit)} />
                    }
                    {status === 'STARTED' && 
                        <View style={{height: '40%', aspectRatio: 1/1, justifyContent: 'center', alignItems: 'center'}}>
                            {trick?.moves.map((move: BatakMove, i: number) => 
                                <View key={`stackCard${i}`} 
                                    style={{
                                        top: move.card.number,
                                        left: move.card.number,
                                        position: 'absolute',
                                        height: '100%',
                                        aspectRatio: 1/1.5,
                                        display: 'flex',
                                    }}>
                                    <CardComponent number={move.card.number} type={move.card.type} />
                                </View>
                            )}
                        </View>
                    }
                </View>
                <View style={style.rightPlayer}>
                    {rightPlayer && <BatakPlayerComp batakPlayer={rightPlayer} />}
                </View>
            </View>
            <View style={[style.currentPlayer]}>
                <View style={[
                    {flexDirection: 'row', justifyContent: 'center'}, 
                    (turn === player.id) ? style.activeTurn : {}
                ]}>
                    {hand?.map((card: Card, index: number) => {
                        const isAvailable = (availableCards?.find(c => (c.type == card.type) && (c.number == card.number)));
                        return <CardComponent 
                            key={`currentPlayerCards_${index}`}
                            style={{
                                backgroundColor: isAvailable ? 'white': '#eee',
                                marginLeft: -15, 
                                borderWidth: 1, borderColor: '#ccc',
                                maxWidth: INNER_WIDTH/(hand?.length), minWidth: 40, aspectRatio: 1/1.5, height: 'auto'
                            }} 
                            disabled={!(isCurrentPlayerTurn && isAvailable && !playing)}
                            number={card.number} 
                            type={card.type} 
                            onPress={() => {
                                if (isCurrentPlayerTurn && isAvailable && !playing) playCard(card)
                            }}
                        />
                    })}
                </View>
            </View>
        </View>
    )

}

const BATAK_PLAYER_SIZE = 30;
const BatakPlayerComp = ({batakPlayer}: any) => {

    const {player, socketClient} = usePlayer();
    const batak = useBatak();

    const progress = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            backgroundColor: (batak?.turn === batakPlayer?.id) ? LOKAL_COLORS.WARNING : LOKAL_COLORS.ONLINE_FADED
        } 
    });

    const [playerBid, setPlayerBid] = useState<number>(batakPlayer.bid);

    useEffect(() => {
        if (batak?.turn === batakPlayer?.id) {
            progress.value = withRepeat(withTiming(0.8, {duration: 200}), -1, true);
        }
        else {
            progress.value = 1;
        }

        const batakPlayerBidSubscription = socketClient?.subscribe(`/topic/game/batak/${batak.batakId}/player/${batakPlayer.id}/bid`, (message: any) => {
            const playerBid = JSON.parse(message.body) as number;
            
            setPlayerBid(playerBid);
        });

        return () => {
            batakPlayerBidSubscription?.unsubscribe();
        }
    }, [batak.turn, socketClient]);

    useEffect(() => {
        setPlayerBid(undefined);
    }, [batak.batakId]);

    return <>
        <Animated.View style={[{width: BATAK_PLAYER_SIZE, height: BATAK_PLAYER_SIZE, justifyContent: 'center', alignItems: 'center'}, animatedStyle]}>
            {batak?.status === 'BIDDING' && !!playerBid && <LokalText>{playerBid}</LokalText>}
            {/* {batak?.status === 'STARTED' && batak?.bid?.playerId === batakPlayer.id && <LokalText>{playerBid}[{batak?.bid?.trump}]</LokalText>} */}
        </Animated.View>
    </>
}

const BidSelection = ({availableBids, onSelect}: any) => {
    return <View>
        <Pressable 
            key={`bidValue_pas`} 
            onPress={() => onSelect(0)}
        >
            <LokalText>#pas</LokalText>
        </Pressable>
        {availableBids.map((value: number) => 
            <Pressable 
                key={`bidValue${value}`} 
                onPress={() => onSelect(value)}
            >
                <LokalText>#{value}</LokalText>
            </Pressable>
        )}
    </View>
}

const BidTypeSelection = ({onSelect}: any) => {

    return <View>     
        <Pressable key={`bidTypeValue_SPADES`} onPress={() => onSelect('SPADES')}><LokalText style={{fontSize: 40}}>[<LokalSpade size={40} />]</LokalText></Pressable>
        <Pressable key={`bidTypeValue_CLUBS`} onPress={() => onSelect('CLUBS')}><LokalText style={{fontSize: 40}}>[<LokalClub size={40} />]</LokalText></Pressable>
        <Pressable key={`bidTypeValue_HEARTS`} onPress={() => onSelect('HEARTS')}><LokalText style={{fontSize: 40}}>[<LokalHeart size={40} />]</LokalText></Pressable>
        <Pressable key={`bidTypeValue_DIAMONDS`} onPress={() => onSelect('DIAMONDS')}><LokalText style={{fontSize: 40}}>[<LokalDiamond size={40} />]</LokalText></Pressable>
    </View>
}

const style = StyleSheet.create({
    topPlayer: {flex: 2, justifyContent: 'flex-start', alignItems: 'center'},
    leftPlayer: {flex: 1, justifyContent: 'center', alignItems: 'flex-start'},
    rightPlayer: {flex: 1, justifyContent: 'center', alignItems: 'flex-end'},
    currentPlayer: {flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'flex-end'},
    activeTurn: {
        // backgroundColor: '#f38a8a67',
        shadowColor: '#df5c5c',
        shadowOffset: {width: -10, height: 10},
        shadowOpacity: 0.7,
        shadowRadius: 20
    }
});