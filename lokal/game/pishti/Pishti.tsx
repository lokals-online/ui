import { BlurView } from "expo-blur";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LokalText, LokalTextBlink } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";
import { usePlayer } from "../../player/CurrentPlayer";
import { CardComponent, ClosedCard } from "./Card";
import { usePishtiSession } from "./PishtiSessionProvider";
import { Card, Pishti } from "./pishtiUtil";
import { usePishti } from "./PishtiProvider";
import { PishtiFormComponent } from "./PishtiFormComponent";

const PishtiComponent = () => {

    const {session, newSession, reloadSession, opponent, setOpponent} = usePishtiSession();

    const {player, socketClient} = usePlayer();
    const {pishti} = usePishti();

    const isCurrentPlayerTurn = useMemo<boolean>(() => pishti?.turn === player?.id, [player, pishti]);
    const status = useMemo<string>(() => session?.status, [pishti, session]);

    if (status === 'INITIAL') {
        return <PishtiFormComponent />
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
            
            {(pishti?.turn === 'ENDED') && 
                <BlurView intensity={40} tint="dark" style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    zIndex:100, width:'100%', height: '100%', position: 'absolute', top: 0, left:0
                }}>
                    <LokalText>yeni oyun başlıyor...</LokalText>
                </BlurView>
            }

            {!isCurrentPlayerTurn && 
                <LokalTextBlink intervalInMs={3000} 
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
                <LokalTextBlink intervalInMs={3000} 
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
                    {Array.from({ length: pishti?.opponent?.hand || 0 }, (_, i) => <ClosedCard key={`oppHand${i}`} />)}
                </View>
            </View>

            <View style={[style.stack]}>
                <View style={{
                    height: '50%', 
                    aspectRatio: 1/1, 
                    // borderWidth: 1, 
                    // borderColor: 'blue'
                }}>
                    {pishti?.stack?.map((card: Card, i: number) => 
                        <View key={`stackCard${i}`} 
                            style={{
                                // top: `${Math.floor(Math.random() * 20)}%`,
                                // left: `${Math.floor(Math.random() * 40)}%`,
                                top: card.number,
                                left: card.number,
                                position: 'absolute',
                                height: '80%',
                                borderWidth: 1,
                                borderColor: '#444'
                            }}
                        >
                            <CardComponent number={card.number} type={card.type} />
                        </View>
                    )}
                </View>
            </View>
            
            <View style={[style.currentPlayer]}>
                <View style={[style.currentPlayerHand, (isCurrentPlayerTurn ? style.activeTurn : {})]}>
                        {pishti?.hand.map((card: Card, i: number) => 
                            <CardComponent key={`playerHand${i}`} 
                                number={card.number} 
                                type={card.type} 
                                onPress={() => {if (isCurrentPlayerTurn) pishtiApi.game.play(session?.id, pishti.id, card)}}
                            />
                        )}
                    </View>
            </View>

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