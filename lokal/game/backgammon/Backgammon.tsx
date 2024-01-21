import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { LokalText } from "../../common/LokalCommons";
import { INNER_WIDTH, LOKAL_COLORS, LOKAL_STATUS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { BackgammonGameContext, useDimensions } from "./BackgammonContext";
import { useBackgammon } from "./BackgammonProvider";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import styles from "./backgammonStyles";
import { BoardView, DiceComponent } from "./board/view/BoardView";
import { BackgammonFormComponent } from "./BackgammonForm";

interface BackgammonProps {
    sessionId: string;
    id: string;
    masaSize: number;
}
const BackgammonGamePlayComponent = ({setQrVisible}: any) => {

    const navigation = useNavigation();
    const {player, status, socketClient} = usePlayer();
    const dimensions = useDimensions(INNER_WIDTH);

    const {session, newSession} = useBackgammonSession();
    const {backgammon} = useBackgammon();
    
    const currentPlayer = useMemo(() => {
        if (!backgammon) return null;

        return (backgammon.firstPlayer?.id === player.id) ? backgammon.firstPlayer : backgammon.secondPlayer;
    }, [session, backgammon]);
    const opponent = useMemo(() => {
        if (!backgammon) return null;
        // console.log("OPP PLAYER =======> BG ==========>", player, backgammon);
        return (backgammon?.firstPlayer?.id === player.id) ? backgammon?.secondPlayer : backgammon?.firstPlayer;
    }, [session, backgammon]);
    const turn = useMemo(() => {
        return backgammon?.turn
    }, [session, backgammon]);

    return (
        <BackgammonGameContext.Provider value={{
            dimensions: dimensions,
            id: backgammon?.id,
            sessionId: session?.id,
            currentPlayer: currentPlayer,
            opponent: opponent,
            turn: turn
        }}>
            <View style={[styles.backgammon, {backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}]}>
                {
                    (session?.status === 'INITIAL') && <BackgammonFormComponent />
                }
                {
                    (session?.status === 'WAITING') && <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignContent: 'space-around'}}>
                        <DiceComponent value={session?.home.firstDie || '?'} color={session?.home.firstDie ? LOKAL_COLORS.WARNING : LOKAL_COLORS.WARNING_FADED} />
                        <DiceComponent value={session?.away?.firstDie || '?'} color={session?.away?.firstDie ? LOKAL_COLORS.WARNING : LOKAL_COLORS.WARNING_FADED} />
                    </View>
                }
                {
                    (session?.status === 'ENDED') && <View style={{flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <><LokalText>oyun bitti.</LokalText></>
                        <><LokalText style={{fontSize: 24}}>kazanan: [{(backgammon?.report?.winner === currentPlayer?.id) ? currentPlayer?.username : opponent?.username}]</LokalText></>
                        <Pressable onPress={() => navigation.reset({index: 0, routes: [{ name: 'lokal' }]})}><LokalText>[lokale dön]</LokalText></Pressable>
                    </View>
                }
                {
                    (session?.status !== 'ENDED') && (backgammon?.report?.status === 'ENDED') && <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignContent: 'space-around'}}>
                        <><LokalText>yeni oyun başlıyor.</LokalText></>
                    </View>
                }

                {(backgammon?.report?.status === 'STARTED') && 
                    <View style={{
                        width: dimensions.boardWidth,
                        height: dimensions.boardHeight,
                        alignSelf: "center",
                        backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE,
                    }}>
                        <BoardView possibleMoves={backgammon?.possibleMoves || []} />
                    </View>
                }
            </View>
        </BackgammonGameContext.Provider>
    )
};

export default BackgammonGamePlayComponent;