import { Pressable, View, StyleSheet } from "react-native";
import { LokalSquare, LokalText } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { Backgammon, BackgammonPlayer, BackgammonSettings } from "./backgammonUtil";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import { useMemo } from "react";

interface ScoreboardProps {
    home?: BackgammonPlayer;
    away?: BackgammonPlayer;
    settings?: BackgammonSettings;
}
export const BackgammonScoreboard = ({}: any) => {
    const {player} = usePlayer();
    const {session, updateSessionSettings} = useBackgammonSession();

    const homeColor = useMemo<string>(() => (player.id === session?.home?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);
    const awayColor = useMemo<string>(() => (player.id === session?.away?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);

    console.log(player.id === session?.away?.id);
    return (
        session?.id !== 'new' && <View style={{height: '100%', flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <LokalText style={{color: homeColor}}>
                    {(session?.home?.username === 'oyuncu') ? 'ev sahibi' : session?.home?.username}
                </LokalText>
                <LokalText style={{fontSize: 40, color: homeColor}}>
                    {session?.home?.score}
                </LokalText>
            </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {session?.status && session.status === 'STARTED' && <>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <LokalText style={{color: LOKAL_COLORS.ONLINE_FADED, fontSize: 40, margin: 10}}>{session.settings.raceTo}</LokalText>
                    </View>
                </>}
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <LokalText style={{color: awayColor}}>
                    {((session?.away) && (session?.away?.username !== 'oyuncu')) ? session?.away?.username : 'deplasman'}
                </LokalText>
                <LokalText style={{fontSize: 40, color: awayColor}}>
                    {session?.away?.score  || 0}
                </LokalText>
            </View>
        </View>
    );
}