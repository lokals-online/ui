import { Pressable, View, StyleSheet, Modal, TextInput } from "react-native";
import { LokalSquare, LokalText } from "../../common/LokalCommons";
import { INNER_WIDTH, LOKAL_COLORS } from "../../common/LokalConstants";
import { usePlayer } from "../../player/CurrentPlayer";
import { Backgammon, BackgammonPlayer, BackgammonSettings } from "./backgammonUtil";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import { useEffect, useMemo, useState } from "react";
import { BlurView } from "expo-blur";
import { CurrentPlayerProfile, OpponentProfile, Player } from "../../player/Player";

interface ScoreboardProps {
    home?: BackgammonPlayer;
    away?: BackgammonPlayer;
    settings?: BackgammonSettings;
}
export const BackgammonScoreboard = ({}: any) => {
    const {player} = usePlayer();
    const {session} = useBackgammonSession();

    const homeColor = useMemo<string>(() => (player.id === session?.home?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);
    const awayColor = useMemo<string>(() => (player.id === session?.away?.id) ? LOKAL_COLORS.WHITE : LOKAL_COLORS.OFFLINE, [session, player]);

    return (
        session?.id !== 'new' && <View style={{height: '100%', flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                {session?.home?.id === player?.id && <CurrentPlayerProfile />}
                {session?.home?.id !== player?.id && <OpponentProfile opponent={session?.home as Player} />}
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
                {session?.away?.id === player?.id && <CurrentPlayerProfile />}
                {session?.away?.id !== player?.id && <OpponentProfile opponent={session?.away as Player} />}
                
                <LokalText style={{fontSize: 40, color: awayColor}}>
                    {session?.away?.score  || 0}
                </LokalText>
            </View>
        </View>
    );
}

