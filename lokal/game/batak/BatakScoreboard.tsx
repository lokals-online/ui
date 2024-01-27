import React from "react";
import { StyleSheet, View } from "react-native";
import { LokalSuit, LokalText } from "../../common/LokalCommons";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBatak } from "./BatakProvider";
import { useBatakSession } from "./BatakSessionProvider";
import { BatakPlayer } from "./batakUtil";
import { LOKAL_COLORS } from "../../common/LokalConstants";

export const BatakScoreboard = () => {
    const {player, socketClient} = usePlayer();

    const {currentPlayer, rightPlayer, topPlayer, leftPlayer} = useBatakSession();    
    
    return (
        <View style={{height: '100%', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'stretch', alignItems: 'stretch'}}>
            <View style={batakScoreboardStyle.batakTopPlayer}>
                <ScoreboardBatakPlayer player={topPlayer} />
            </View>
            <View style={{width: '100%', height: '50%', position: 'absolute', top: '25%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={batakScoreboardStyle.batakLeftPlayer}>
                    <ScoreboardBatakPlayer player={leftPlayer} />
                </View>
                <View style={batakScoreboardStyle.batakRightPlayer}>
                    <ScoreboardBatakPlayer player={rightPlayer} />
                </View>
            </View>
            <View style={batakScoreboardStyle.batakCurrentPlayer}>
                <ScoreboardBatakPlayer player={currentPlayer} />
            </View>
        </View>
    );
}

const ScoreboardBatakPlayer = ({player}: any) => {
    const batak = useBatak();

    if (!player?.id) {
        return <LokalText style={{fontSize: 30}}>?</LokalText>   
    }
    else return <>
        <LokalText>
            {player?.username}
            {(batak?.bid?.playerId === player?.id) && 
                <LokalText>[{batak?.bid?.value}
                    <LokalSuit type={batak?.bid?.trump} />
                ]</LokalText>}
        </LokalText>
        <LokalText style={{fontSize: 30}}>{player?.score || 0}</LokalText>
        {batak?.status === 'STARTED' && <LokalText style={{fontSize: 14, color: LOKAL_COLORS.ONLINE_FADED}}>({(batak?.currentMatchScores && player) ? batak?.currentMatchScores[player?.id] : 0})</LokalText>}
    </>
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