import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LokalText, LokalTextBlink } from "../../../../common/LokalCommons";
import { LOKAL_COLORS } from "../../../../common/LokalConstants";
import { usePlayer } from "../../../../player/CurrentPlayer";
import { Point, useBackgammonGame } from "../../BackgammonContext";
import { BackgammonPlayer, Move, Turn } from "../../backgammonUtil";
import { Checker } from "./Checker";
import { PointComponent } from "./Point";
import { BackgammonBarComponent } from "./BackgammonBar";

export interface BoardProps {
    possibleMoves?: Array<Move>;
    selectedDice?: number;
    // addMove: (move: Move) => void;
    // moves: Array<Move>;
}
export const BoardView = ({ possibleMoves }: BoardProps) => {

    const { player } = usePlayer();
    const {
        id,
        sessionId,
        currentPlayer,
        opponent,
        turn,
        dimensions
    } = useBackgammonGame();

    const points = Array.from({ length: 24 }, (_, i) => {
        if (i >= 18) {
            return { index: i, positionLeft: ((23 - i) * dimensions.pointWidth), positionTop: 0, placement: 'pointTop' } as Point;
        }
        else if (i < 18 && i >= 12) {
            return { index: i, positionLeft: (((23 - i) * dimensions.pointWidth) + dimensions.barWidth), positionTop: 0, placement: 'pointTop' } as Point;
        }
        else if (i < 12 && i >= 6) {
            return { index: i, positionLeft: ((i * dimensions.pointWidth) + dimensions.barWidth), positionTop: dimensions.pointHeight, placement: 'pointBottom' } as Point;
        }
        else {
            return { index: i, positionLeft: ((i * dimensions.pointWidth)), positionTop: dimensions.pointHeight, placement: 'pointBottom' } as Point;
        }
    });

    const [selectedPoint, setSelectedPoint] = useState<number>();
    const [highlightedPoint, setHighlightedPoint] = useState<number>(-1);

    const targetPoints = useMemo<Array<number>>(() => {
        // console.log("selected!", selectedPoint)
        if (selectedPoint === undefined || selectedPoint === null) return [];
        return possibleMoves
            .filter((move: Move) => (move.from === selectedPoint))
            .map((move: Move) => move.to);
    }, [selectedPoint]);

    const diceColors = useMemo(() => {
        if (!turn || turn.playerId !== player.id) return [LOKAL_COLORS.OFFLINE,LOKAL_COLORS.OFFLINE];
        if (!turn.moves || turn.moves.length === 0) return [LOKAL_COLORS.WARNING, LOKAL_COLORS.WARNING];
        
        let dice1 = '';
        let dice2 = '';
        if (turn?.dices[0] === turn?.dices[1]) {
            if (turn.moves.length === 1) {
                return [LOKAL_COLORS.WARNING, LOKAL_COLORS.WARNING_FADED]
            }
            else if (turn.moves.length === 2) {
                return [LOKAL_COLORS.WARNING, LOKAL_COLORS.OFFLINE]
            }
            else if (turn.moves.length === 3) {
                return [LOKAL_COLORS.WARNING_FADED, LOKAL_COLORS.OFFLINE]
            }
        }
        else {
            dice1 = turn?.remainingDices?.includes(turn?.dices[0]) ? LOKAL_COLORS.WARNING : LOKAL_COLORS.ONLINE_FADED;
            dice2 = turn?.remainingDices?.includes(turn?.dices[1]) ? LOKAL_COLORS.WARNING : LOKAL_COLORS.ONLINE_FADED;
        }

        console.log(turn.moves, dice1, dice2);

        return [dice1, dice2];
    }, [turn]);

    return (
        <View style={boardStyles.board}>

            <BackgammonBarComponent selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} targetPoints={targetPoints} />

            {/* {points.map((point: Point, index: number) => <LokalText key={index}>{index}</LokalText>)} */}
            {points.map((point: Point, index: number) => {
                const isMoveable = (turn.playerId === player.id) && possibleMoves && possibleMoves.some((m: Move) => (m.from === index));
                const isPickable = (turn.playerId === player.id) && possibleMoves && possibleMoves.some((m: Move) => (m.from === index) && (m.to === -1));
                const isSelected = selectedPoint === index;
                const isTarget = targetPoints.includes(index);
                
                // console.debug("current player checkers", currentPlayer);
                // console.log("opponent checkers", opponent);
                return <PointComponent key={`point-${index}`}
                    index={index} point={point}
                    isMoveable={isMoveable}
                    isTarget={isTarget}
                    isPickable={isPickable}
                    isSelected={isSelected}
                    selectedPoint={selectedPoint}
                    setSelectedPoint={setSelectedPoint} >
                    {currentPlayer.checkers[index] && Array.from(
                        { length: currentPlayer.checkers[index] }, 
                        (v, i) => <Checker key={`point-${index}-curr-${i}`} 
                                color={player.settings.selfColor} 
                                style={(turn.playerId === currentPlayer.id && isMoveable) ? boardStyles.moveableChecker : {}} />
                    )}
                    {opponent.checkers[23-index] && Array.from(
                        { length: opponent.checkers[23-index] }, 
                        (v, i) => <Checker key={`point-${index}-opp-${i}`} color={player.settings.opponentColor} style={{borderWidth: 2, borderColor: '#333'}} />
                    )}
                </PointComponent>
                }
            )}

            {/* OPPONENT INDICATOR LED! */}
            {(turn?.playerId === opponent.id) && 
                <LokalTextBlink intervalInMs={3000} 
                    style={{
                        position: 'absolute', 
                        top: -dimensions.barWidth/3, 
                        left: 'center',
                        width: dimensions.barWidth, 
                        heigth: dimensions.barWidth, 
                        justifyContent: 'flex-end',
                        alignSelf: 'center',
                        borderBottomWidth: 10,
                        borderColor: LOKAL_COLORS.WARNING
                    }}>
                </LokalTextBlink>
            }
            {/* CURRENT PLAYER INDICATOR LED! */}
            {(turn?.playerId === currentPlayer.id) && 
                <LokalTextBlink intervalInMs={3000} 
                    style={{
                        position: 'absolute', 
                        bottom: -dimensions.barWidth/3, 
                        left: 'center',
                        width: dimensions.barWidth, 
                        heigth: dimensions.barWidth, 
                        justifyContent: 'flex-end',
                        alignSelf: 'center',
                        borderTopWidth: 10,
                        borderColor: LOKAL_COLORS.WARNING
                    }}>
                </LokalTextBlink>
            }

            {/* DICE */}
            {turn?.playerId && turn?.dices && <>
                <View pointerEvents="none" style={{
                    position: 'absolute',
                    width: '100%', 
                    zIndex: 1000,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <DiceComponent value={turn?.dices[0]} color={diceColors[0]} />
                    <DiceComponent value={turn?.dices[1]} color={diceColors[1]} />
                </View>
            </>}
        </View>
    );
}

export const DiceComponent = ({value, size, color}: any) => {

    return (
        <View pointerEvents="none" style={{
            aspectRatio: 1,
            borderWidth: 2,
            borderColor: color,
            backgroundColor: color,
            padding: 10,
            justifyContent: 'center', 
            alignItems: 'center',
        }}>
            <LokalText onSelectionChange={() => console.log("asdad")} pointerEvents="none" style={{color: 'white', fontSize: size || 30}}>
                {value || '?'}
            </LokalText>
        </View>
    )
}

export const boardStyles = StyleSheet.create({
    board: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'pink',
        backgroundColor: 'transparent',// LOKAL_COLORS.OFFLINE,
        zIndex: 1,
    },
    playedDice: {
        backgroundColor: 'black',
        color: 'white'
    },
    dice: {
        display: 'flex',
        position: 'absolute',
        width: 50,
        height: 50,
        fontSize: 30,
        justifyContent: "center",
        alignItems: 'center',
    },
    moveableChecker: {
        borderWidth: 2,
        borderColor: '#0002',
        shadowColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.83,
        shadowRadius: 13.97,
        elevation: 21,
    }
});
