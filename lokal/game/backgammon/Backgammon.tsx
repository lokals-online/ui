import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { LokalText } from "../../common/LokalCommons";
import { INNER_WIDTH, LOKAL_COLORS, LOKAL_STATUS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBackgammon } from "./BackgammonProvider";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import styles from "./backgammonStyles";
import { BoardView, DiceComponent } from "./board/view/BoardView";
import { BackgammonFormComponent } from "./BackgammonForm";
import { TableQr } from "../../masa/TableQr";

interface BackgammonProps {
    sessionId: string;
    id: string;
    masaSize: number;
}
const BackgammonGamePlayComponent = ({setQrVisible}: any) => {

    const navigation = useNavigation();
    const {status} = usePlayer();

    const {session} = useBackgammonSession();
    const {currentPlayer, opponent, report, dimensions} = useBackgammon();

    return (
        <View style={[styles.backgammon, 
            {backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}
        ]}>
            {
                (session?.status === 'INITIAL') && <BackgammonFormComponent />
            }
            {
                (session?.status === 'WAITING_OPPONENT') && <TableQr url={Linking.createURL(`/tavla/${session?.id}`)} />
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
                    <><LokalText style={{fontSize: 24}}>kazanan: [{(report?.winner === currentPlayer?.id) ? currentPlayer?.username : opponent?.username}]</LokalText></>
                    <Pressable onPress={() => navigation.reset({index: 0, routes: [{ name: 'lokal' }]})}><LokalText>[lokale dön]</LokalText></Pressable>
                </View>
            }
            {
                (session?.status !== 'ENDED') && (report?.status === 'ENDED') && <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignContent: 'space-around'}}>
                    <><LokalText>yeni oyun başlıyor.</LokalText></>
                </View>
            }

            {(report?.status === 'STARTED') && 
                <View style={{
                    width: dimensions.boardWidth,
                    height: dimensions.boardHeight,
                    alignSelf: "center",
                    backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE,
                }}>
                    <BoardView />
                </View>
            }
        </View>
    )
};

export default BackgammonGamePlayComponent;