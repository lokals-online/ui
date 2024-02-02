import { useMemo, useState } from "react";
import { View } from "react-native";
import { LokalSquare, LokalText } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { CurrentPlayerProfile, OpponentProfile, Player } from "../../player/Player";
import { usePishti } from "./PishtiProvider";
import { usePishtiSession } from "./PishtiSessionProvider";

export const PishtiScoreboard = () => {
    const {player} = usePlayer();
    const {session} = usePishtiSession();
    const {pishti} = usePishti();

    const currentMatchHomeScore = useMemo<number>(() => {
        return session?.home?.id === player.id ? pishti?.score : pishti?.opponent?.score;
    }, [session, pishti]);
    
    const currentMatchAwayScore = useMemo<number>(() => {
        return session?.away?.id === player.id ? pishti?.score : pishti?.opponent?.score;
    }, [session, pishti]);

    const homeColor = useMemo<string>(() => (player.id === session?.home?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);
    const awayColor = useMemo<string>(() => (player.id === session?.away?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);

    return (
        session?.id !== 'new' && <View style={{height: '100%', flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {session?.home?.id === player?.id && <CurrentPlayerProfile />}
                {session?.home?.id !== player?.id && <OpponentProfile opponent={session?.home as Player} />}
                
                <LokalText style={{fontSize: 40, color: homeColor}}>{session?.home?.score}</LokalText>
                {!!currentMatchHomeScore && <LokalText style={{fontSize: 20, color: homeColor}}>({currentMatchHomeScore})</LokalText>}
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
                {!session?.away && <LokalText style={{fontSize: 40, color: awayColor}}>?</LokalText>}

                {session?.away && <>
                    {session?.away?.id === player?.id && <CurrentPlayerProfile />}
                    {session?.away?.id !== player?.id && <OpponentProfile opponent={session?.away as Player} />}
                    
                    <LokalText style={{fontSize: 40, color: awayColor}}>{session?.away?.score || 0}</LokalText>
                    {!!currentMatchAwayScore && <LokalText style={{fontSize: 20, color: awayColor}}>({currentMatchAwayScore})</LokalText>}
                </>}
            </View>
        </View>
    );
}