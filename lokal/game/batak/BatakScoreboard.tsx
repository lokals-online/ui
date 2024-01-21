import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LokalSquare, LokalSuit, LokalText } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { useLokal } from "../../LokalContext";
import { usePlayer } from "../../player/CurrentPlayer";
import { Batak, BatakPlayer, BatakSession } from "./batakUtil";
import { Player } from "../../player/Player";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { useBatakSession } from "./BatakSessionProvider";
import { useBatak } from "./BatakProvider";

export const BatakScoreboard = () => {
    const {player, socketClient} = usePlayer();

    const {session} = useBatakSession();
    const {batak} = useBatak();

    const currentPlayerIndex = useMemo(() => {
        if (batak?.players) {
            return batak?.players?.findIndex((p: BatakPlayer) => p?.id === player?.id)
        }
    }, [batak, player]);
    const currentPlayer = useMemo<BatakPlayer>(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex)%4] as BatakPlayer;
        }
    }, [batak, currentPlayerIndex]);
    const rightPlayer = useMemo<BatakPlayer>(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex+1)%4] as BatakPlayer;
        }
    }, [batak, currentPlayerIndex]);
    const topPlayer = useMemo<BatakPlayer>(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex+2)%4] as BatakPlayer;
        }
    }, [batak, currentPlayerIndex]);
    const leftPlayer = useMemo<BatakPlayer>(() => {
        if (batak?.players) {
            return batak?.players[(currentPlayerIndex+3)%4] as BatakPlayer;
        }
    }, [batak, currentPlayerIndex]);

    const availableBids = useMemo(() => {
        if (batak?.bid?.value) {
            return Array.from({length: 13-batak.bid.value}, (_, i) => (i+batak.bid.value) + 1)
        }
    }, [batak]);

    return (
        session && <View style={{height: '100%', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'stretch', alignItems: 'stretch'}}>
            <View style={batakScoreboardStyle.batakTopPlayer}>
                <LokalText>
                    {topPlayer?.username}
                    {(batak?.bid?.playerId === topPlayer?.id) && 
                        <LokalText>[{batak?.bid?.value}
                            <LokalSuit type={batak?.bid?.trump} />
                        ]</LokalText>}
                </LokalText>
                <LokalText style={{fontSize: 30}}>{topPlayer?.score || 0}</LokalText>
                <LokalText style={{fontSize: 14}}>({(session?.scores && session?.scores[topPlayer?.id]) || 0})</LokalText>
            </View>
            <View style={{width: '100%', height: '50%', position: 'absolute', top: '25%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={batakScoreboardStyle.batakLeftPlayer}>
                    <LokalText>
                        {leftPlayer?.username}
                        {(batak?.bid?.playerId === leftPlayer?.id) && 
                            <LokalText>[{batak?.bid?.value}
                                <LokalSuit type={batak?.bid?.trump} />
                            ]</LokalText>}
                    </LokalText>
                    <LokalText style={{fontSize: 30}}>{leftPlayer?.score || 0}</LokalText>
                    <LokalText style={{fontSize: 14}}>({(session?.scores && session?.scores[leftPlayer?.id]) || 0})</LokalText>
                </View>
                <View style={batakScoreboardStyle.batakRightPlayer}>
                    <LokalText>{rightPlayer?.username}</LokalText>
                    {(batak?.bid?.playerId === rightPlayer?.id) && <LokalText>[{batak?.bid?.value}
                        <LokalSuit type={batak?.bid?.trump} />
                    ]</LokalText>
                    }
                    <LokalText style={{fontSize: 30}}>{rightPlayer?.score || 0}</LokalText>
                    <LokalText style={{fontSize: 14}}>({(session?.scores && session?.scores[rightPlayer?.id]) || 0})</LokalText>
                </View>
            </View>
            <View style={batakScoreboardStyle.batakCurrentPlayer}>
                <LokalText>{player?.username}</LokalText>
                {(batak?.bid?.playerId === player?.id) && 
                    <LokalText>[{batak?.bid?.value}<LokalSuit size={14} type={batak?.bid?.trump} />]</LokalText>
                }
                <LokalText style={{fontSize: 30}}>{(currentPlayer?.score) || 0}</LokalText>
                <LokalText style={{fontSize: 14}}>({(session?.scores && session?.scores[currentPlayer?.id]) || 0})</LokalText>
            </View>

        </View>
    );
}

const batakScoreboardStyle = StyleSheet.create({
    batakCurrentPlayer: {
        width: '100%', height: '50%', 
        position: 'absolute', top: '50%', 
        justifyContent: 'center', alignItems: 'center', 
        backgroundColor: 'transparent'
    },
    batakRightPlayer: {width: '50%', justifyContent: 'center', alignItems: 'center'},
    batakTopPlayer: {width: '100%', height: '50%', position: 'absolute', top: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'},
    batakLeftPlayer: {width: '50%', justifyContent: 'center', alignItems: 'center'},
});