import {usePlayer} from "../../../../player/CurrentPlayer";
import {Pressable, StyleSheet, View} from "react-native";
import {Checker, HitChecker} from "./Checker";
import React from "react";
import { LOKAL_COLORS } from "../../../../common/LokalConstants";
import { backgammonApi } from "../../../../chirak/chirakApi/game/backgammonApi";
import { useBackgammon } from "../../BackgammonProvider";
import { useBackgammonSession } from "../../BackgammonSessionProvider";

export const BackgammonBarComponent = ({targetPoints, selectedPoint, setSelectedPoint}: any) => {
    const { player } = usePlayer();
    const {session} = useBackgammonSession();
    const {id, currentPlayer, opponent, dimensions} = useBackgammon();

    return (
        <View style={[barStyle.bar, {width: dimensions.barWidth, height: dimensions.boardHeight}]}>
            <View style={[barStyle.barOpponent, {
                width: dimensions.barWidth,
                top: 0,
            }]}>
                {opponent && Array.from({length: opponent.hitCheckers}, (_, index) =>
                    <Checker key={`opponent-hitCheckers-${index}`} color={player.settings.opponentColor}/>
                )}
            </View>
            <View style={[barStyle.barCurrentPlayer, {
                width: dimensions.barWidth,
                top: dimensions.boardHeight/2,
                // backgroundColor: (targetPoints.includes(-1)) ? LOKAL_COLORS.WARNING_FADED : 'transparent',
                
            }]}>
                {/* {!!currentPlayer?.hitCheckers &&  */}
                    <Pressable 
                        style={{
                            width: '100%', height: '50%', alignItems: 'center', 
                            // borderWidth: 1, borderColor: '#eee'
                        }}
                        onPress={() => setSelectedPoint(24)}
                    >
                        {currentPlayer && Array.from({length: currentPlayer.hitCheckers}, (_, index) =>
                            <Checker key={`opponent-hitCheckers-${index}`} color={player.settings.selfColor} />
                        )}
                    </Pressable>
                {/* } */}

                {/* {targetPoints && targetPoints.includes(-1) &&  */}
                    <Pressable 
                        style={{
                            width: '100%', 
                            height: '50%', 
                            alignItems: 'center', 
                            justifyContent: 'flex-end',
                            backgroundColor: (targetPoints.includes(-1)) ? LOKAL_COLORS.WARNING_FADED : 'transparent',
                            borderWidth: 2, borderColor: (targetPoints?.includes(-1)) ? LOKAL_COLORS.WARNING : 'transparent'
                        }}
                        onPress={() => {
                            if (targetPoints.includes(-1)) {
                                // console.debug("selected point:", selectedPoint)
                                
                                backgammonApi.game.move(session.id, id,[{from: selectedPoint, to: -1}]);

                                setSelectedPoint(null);
                            }
                        }}
                    >
                        {currentPlayer && Array.from({length: Object.values(currentPlayer.checkers).reduce((n: number, value:number) => n-value, 15-currentPlayer.hitCheckers)}, (_, index) =>
                            // <Checker key={`opponent-hitCheckers-${index}`} color={player.settings.selfColor} />
                            <View 
                                key={`current-popChecker-${index}`} 
                                style={{
                                    width: '100%', 
                                    height: 5, 
                                    backgroundColor: player?.settings.selfColor, 
                                    marginTop: 1
                                }}></View>
                        )}
                    </Pressable>
                {/* } */}
            </View>
        </View>
    )
}

const barStyle = StyleSheet.create({
    bar: {
        position: 'absolute',
        left: 'center',
        zIndex: 1,
        alignItems: 'center',
        backgroundColor: '#000'
    },
    barOpponent: {
        position: 'absolute',
        flex: 1,
        height: '50%',
        width: '100%',
        borderWidth:2,
        borderColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    barCurrentPlayer: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        borderWidth:2,
        borderColor: LOKAL_COLORS.ONLINE_FADED,
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});