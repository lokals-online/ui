import {usePlayer} from "../../../../player/CurrentPlayer";
import {useBackgammonGame} from "../../BackgammonContext";
import {Pressable, StyleSheet, View} from "react-native";
import {Checker, HitChecker} from "./Checker";
import React from "react";
import { LOKAL_COLORS } from "../../../../common/LokalConstants";
import { backgammonApi } from "../../../../chirak/chirakApi/game/backgammonApi";

export const BackgammonBarComponent = ({targetPoints, selectedPoint, setSelectedPoint}: any) => {
    const { player } = usePlayer();
    const {sessionId, id, currentPlayer, opponent, dimensions} = useBackgammonGame();

    // console.log("targets:", targetPoints)
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
            }]}>
                <Pressable 
                    style={{
                        width: '100%', height: 'auto', alignItems: 'center', 
                        // borderWidth: 1, borderColor: '#eee'
                    }}
                    onPress={() => setSelectedPoint(24)}
                >
                    {currentPlayer && Array.from({length: currentPlayer.hitCheckers}, (_, index) =>
                        <Checker key={`opponent-hitCheckers-${index}`} color={player.settings.selfColor} />
                    )}
                </Pressable>

                <Pressable 
                    style={{
                        width: '100%', 
                        height: 'auto', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end', 
                        borderWidth: 2, 
                        borderColor: (targetPoints.includes(-1)) ? LOKAL_COLORS.WARNING : 'transparent'
                    }}
                    onPress={() => {
                        if (targetPoints.includes(-1)) {
                            // console.debug("selected point:", selectedPoint)
                            
                            backgammonApi.game.move(sessionId, id,[{from: selectedPoint, to: -1}]);

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
        borderColor: LOKAL_COLORS.ONLINE_FADED,
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