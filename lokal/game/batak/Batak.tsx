import React, { useEffect, useMemo, useState } from "react";
import { LokalClub, LokalDiamond, LokalHeart, LokalSpade, LokalSquare, LokalSquareAnimated, LokalText } from "../../common/LokalCommons";
import { Pressable, StyleSheet, View } from "react-native";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { useLokal } from "../../LokalContext";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { usePlayer } from "../../player/CurrentPlayer";
import { Batak, BatakMove, BatakPlayer } from "./batakUtil";
import { Card, CardType } from "../card/Card";
import { CardComponent } from "../pishti/Card";
import { useBatakSession } from "./BatakSessionProvider";
import { useBatak } from "./BatakProvider";

export const BatakComponent = ({}: any) => {

    const {player, socketClient} = usePlayer();
    const {session, updateSessionSettings} = useBatakSession();
    const {batak} = useBatak();

    const [raceToFormVisible, setRaceToFormVisible] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    const currentPlayerIndex = useMemo(() => {
        if (batak?.players) {
            return batak?.players?.findIndex((p: BatakPlayer) => p.id === player.id)
        }
    }, [batak, session, player]);
    const rightPlayer = useMemo(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex+1)%4];
        }
    }, [batak, session]);
    const topPlayer = useMemo(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex+2)%4]
        }
    }, [batak, session]);
    const leftPlayer = useMemo(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex+3)%4]
        }
    }, [batak, session]);

    const availableBids = useMemo(() => {
        if (batak?.bid?.value) {
            return Array.from({length: 13-batak.bid.value}, (_, i) => (i+batak.bid.value) + 1)
        }
    }, [batak]);

    // console.debug("BATAK", batak, session?.currentMatch);

    if (!batak) {
        return <View style={{height: '100%', justifyContent: 'space-evenly', alignContent: 'space-around'}}>
            <View>
                {!raceToFormVisible && <Pressable onPress={() => setRaceToFormVisible(!raceToFormVisible)}>
                    <LokalText style={{fontSize: 24}}>[{session?.settings?.raceTo}] yapan kazanır</LokalText>
                </Pressable>
                }
                {raceToFormVisible && [11,31,51,71].map((raceTo, index) => 
                    <Pressable 
                        key={`raceTo_${index}`}
                        onPress={() => {
                            updateSessionSettings({raceTo: raceTo});

                            setRaceToFormVisible(!raceToFormVisible);
                        }}>
                            <LokalText style={{fontSize: 40, color: (index === session?.settings?.raceTo) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.ONLINE_FADED}}>{raceTo}</LokalText>
                        </Pressable>
                )}
            </View>
        </View>
    }
    else return (
        <View style={{flex: 1, width: '100%', padding: 5}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}></View>
                <View style={style.topPlayer}>
                    <View style={{height: '60%', flexDirection: 'row'}}>
                        {topPlayer && <BatakPlayerComp batakPlayer={topPlayer} turn={batak.turn} />}
                    </View>    
                </View>
                <View style={{flex: 1}}></View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={style.leftPlayer}>
                    {leftPlayer && <BatakPlayerComp batakPlayer={leftPlayer} turn={batak.turn} />}
                </View>
                <View style={{flex: 2}}>
                    {/* <LokalText>{batak.turn}</LokalText> */}
                    {batak?.status === 'BIDDING' && batak?.turn === player.id && 
                        <BidSelection 
                            availableBids={availableBids} 
                            onSelect={(bidValue: number) => batakApi.game.bid(session?.id, batak?.id, bidValue)} 
                        />
                    }
                    {batak?.status === 'WAITING_TRUMP' && batak.turn === player.id && 
                        <BidTypeSelection onSelect={(cardSuit: string) => batakApi.game.chooseBetType(session?.id, batak?.id, cardSuit)} />
                    }
                    {batak?.status === 'STARTED' && 
                        <View style={{height: '100%', width: '100%', display: 'flex', aspectRatio: 1/1}}>
                            {batak?.trick?.moves.map((move: BatakMove, i: number) => 
                                <View key={`stackCard${i}`} 
                                    style={{
                                        top: `${Math.floor(Math.random() * 20)}%`,
                                        left: `${Math.floor(Math.random() * 40)}%`,
                                        position: 'absolute',
                                        height: '60%',
                                        aspectRatio: 1/1.5,
                                        display: 'flex',
                                        borderWidth: 1,
                                        borderColor: '#eee'
                                    }}>
                                    <CardComponent number={move.card.number} type={move.card.type} />
                                </View>
                            )}
                        </View>
                    }
                </View>
                <View style={style.rightPlayer}>
                    {rightPlayer && <BatakPlayerComp batakPlayer={rightPlayer} turn={batak.turn} />}
                </View>
            </View>
            <View style={[style.currentPlayer]}>
                <View style={[{height: '60%', flexDirection: 'row'}, (batak.turn === player.id) ? style.activeTurn : {}]}>
                    {batak.hand?.map((card: Card, index: number) => 
                        <Pressable 
                            key={`card_${index}`}
                            style={{height: '100%', aspectRatio: 1/1.5, marginLeft: -15, display: 'flex'}}
                            disabled={(disabled) || (player.id !== batak.turn) || (!batak?.availableCards?.find(c => (c.type == card.type) && (c.number == card.number)))} 
                            onPress={() => {
                                setDisabled(true);
                                batakApi.game
                                    .play(session?.id, batak?.id, card)
                                    .then(() => setDisabled(false));
                            }}
                        >
                            <CardComponent 
                                style={{backgroundColor: (batak?.availableCards?.find(c => (c.type == card.type) && (c.number == card.number))) ? 'white': '#eee'}} 
                                number={card.number} 
                                type={card.type} 
                            />
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    )

}

const BATAK_PLAYER_SIZE = 30;
const BatakPlayerComp = ({batakPlayer, turn}: any) => {

    if (turn === batakPlayer?.id) {
        // console.log(batakPlayer, turn)
        return <LokalSquareAnimated size={BATAK_PLAYER_SIZE} style={{backgroundColor: LOKAL_COLORS.WARNING}} />
    }
    else {
        return <LokalSquare style={{
            width: BATAK_PLAYER_SIZE,
            height: BATAK_PLAYER_SIZE,
            backgroundColor: LOKAL_COLORS.ONLINE_FADED
        }} />
    }
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
        <Pressable key={`bidTypeValue_DIAMONDS`} onPress={() => onSelect('SPADES')}><LokalText style={{fontSize: 40}}>[<LokalDiamond size={40} />]</LokalText></Pressable>
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