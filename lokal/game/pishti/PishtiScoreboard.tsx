import { Pressable, View } from "react-native";
import { LokalSquare, LokalText } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { usePishtiSession } from "./PishtiSessionProvider";
import { useEffect, useMemo } from "react";
import { usePishti } from "./PishtiProvider";

export const PishtiScoreboard = () => {
    const {player, socketClient} = usePlayer();
    const {session, updateSessionSettings} = usePishtiSession();
    const {pishti} = usePishti();

    const currentMatchHomeScore = useMemo<number>(() => {
        return session?.home?.id === player.id ? pishti?.score: pishti?.opponent?.score;
    }, [session, pishti]);
    
    const currentMatchAwayScore = useMemo<number>(() => {
        return session?.away?.id === player.id ? pishti?.score : pishti?.opponent?.score;
    }, [session, pishti]);

    const homeColor = useMemo<string>(() => (player.id === session?.home?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);
    const awayColor = useMemo<string>(() => (player.id === session?.away?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);

    return (
        session?.id !== 'new' && <View style={{height: '100%', flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <LokalText style={{color: homeColor}}>
                    {(session?.home?.username === 'oyuncu') ? 'ev sahibi' : session?.home?.username}
                </LokalText>
                <LokalText style={{fontSize: 40, color: homeColor}}>{session?.home?.score}</LokalText>
                <LokalText style={{fontSize: 20, color: homeColor}}>({currentMatchHomeScore})</LokalText>
            </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {session?.status && session.status === 'STARTED' && <>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <LokalText style={{color: LOKAL_COLORS.ONLINE_FADED, fontSize: 40, margin: 10}}>{session.settings.raceTo}</LokalText>
                    </View>
                    <LokalSquare style={{width: 30, 'justifyContent': 'center', alignItems: 'center'}}>
                        <LokalText style={{color: LOKAL_COLORS.ONLINE_FADED}}>{pishti?.remainingCardCount}</LokalText>
                    </LokalSquare>
                </>}
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <LokalText style={{color: awayColor}}>
                    {((session?.away) && (session?.away?.username !== 'oyuncu')) ? session?.away?.username : 'deplasman'}
                </LokalText>
                <LokalText style={{fontSize: 40, color: awayColor}}>{session?.away?.score  || 0}</LokalText>
                <LokalText style={{fontSize: 20, color: awayColor}}>({currentMatchAwayScore})</LokalText>
            </View>
        </View>
    );
}