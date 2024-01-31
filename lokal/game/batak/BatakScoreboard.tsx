import React from "react";
import { StyleSheet, View } from "react-native";
import { LokalSuit, LokalText } from "../../common/LokalCommons";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBatak } from "./BatakProvider";
import { useBatakSession } from "./BatakSessionProvider";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { CurrentPlayerProfile, OpponentProfile } from "../../player/Player";

export const BatakScoreboard = () => {

    const {currentPlayer, rightPlayer, topPlayer, leftPlayer, settings} = useBatakSession();
    const batak = useBatak();

    return (
        <View style={{height: '100%', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'stretch', alignItems: 'stretch'}}>
            <View style={batakScoreboardStyle.batakTopPlayer}>
                <ScoreboardBatakPlayer batakPlayer={topPlayer} />
            </View>
            <View style={{width: '100%', height: '50%', position: 'absolute', top: '25%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <View style={batakScoreboardStyle.batakLeftPlayer}>
                    <ScoreboardBatakPlayer batakPlayer={leftPlayer} />
                </View>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                    <LokalText style={{color: LOKAL_COLORS.ONLINE_FADED, fontSize: 40}}>{settings.raceTo}</LokalText>
                    {batak?.bid?.value && batak?.bid?.trump && <LokalText style={{fontSize: 12, color: LOKAL_COLORS.WARNING_FADED}}>[{batak?.bid?.value}<LokalSuit type={batak?.bid?.trump} />]</LokalText>}
                </View>
                <View style={batakScoreboardStyle.batakRightPlayer}>
                    <ScoreboardBatakPlayer batakPlayer={rightPlayer} />
                </View>
            </View>
            <View style={batakScoreboardStyle.batakCurrentPlayer}>
                <ScoreboardBatakPlayer batakPlayer={currentPlayer} />                
            </View>
        </View>
    );
}

const ScoreboardBatakPlayer = ({batakPlayer}: any) => {
    const {player} = usePlayer();
    const batak = useBatak();

    if (!batakPlayer?.id || batakPlayer?.id !== player?.id) {
        return <>
            <OpponentProfile opponent={batakPlayer} />
            {batakPlayer?.score && <LokalText style={{fontSize: 30, color: player.settings.opponentColor}}>{batakPlayer?.score || 0}</LokalText>}
        </>
    }
    else return <>
        <CurrentPlayerProfile />
        {batakPlayer?.score && <LokalText style={{fontSize: 30}}>{batakPlayer?.score || 0}</LokalText>}
        {batak?.status === 'STARTED' && 
            <LokalText style={{fontSize: 14, color: LOKAL_COLORS.ONLINE_FADED}}>
                ({(batak?.currentMatchScores && player) ? batak?.currentMatchScores[player?.id] : 0})
            </LokalText>
        }
    </>
}

const batakScoreboardStyle = StyleSheet.create({
    batakCurrentPlayer: {
        width: '100%', height: '50%', 
        position: 'absolute', top: '50%', 
        justifyContent: 'center', alignItems: 'center', 
        backgroundColor: 'transparent'
    },
    batakTopPlayer: {width: '100%', height: '50%', position: 'absolute', top: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'},
    batakRightPlayer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    batakLeftPlayer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});