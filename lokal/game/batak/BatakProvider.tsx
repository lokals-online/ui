import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBatakSession } from "./BatakSessionProvider";
import { Batak, BatakMove, BatakPlayer } from "./batakUtil";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { Card } from "../card/Card";
import { Player } from "../../player/Player";
import { LokalFetchingState } from "../../common/LokalCommons";

export interface BatakContext {
    batakId: string;
    hand: Array<Card>;
    availableCards: Array<Card>;
    currentPlayer: BatakPlayer;
    rightPlayer: BatakPlayer;
    topPlayer: BatakPlayer;
    leftPlayer: BatakPlayer;
    currentMatchScores: Map<String, number>;
    bid: {playerId: string, value: number, trump?: string}
    availableBids: Array<number>;
    trick?: {moves: Array<BatakMove>}
    turn: string;
    status: string;
}
const BatakContext = createContext<BatakContext>({} as BatakContext);
export const useBatak = () => {
    return useContext(BatakContext);
}

export const BatakProvider = ({children}: any) => {

    const {player, socketClient} = usePlayer();
    const {sessionId, currentMatchId, currentPlayer, rightPlayer, topPlayer, leftPlayer} = useBatakSession();

    const [batak, setBatak] = useState<Batak>();

    useEffect(() => {
        
        console.debug(`BATAK sessionId:[${sessionId}] id:[${currentMatchId}] , playerId: [${player?.id}]`);

        if (!socketClient && !player || !sessionId || !currentMatchId) {
            return;
        }

        const dataFetch = async () => {
            const batakResult = await batakApi.game.fetch(sessionId, currentMatchId)
      
            console.debug(`BATAK fetched:`, batakResult);
      
            setBatak(batakResult);
        };

        dataFetch();

        const batakSubscription = socketClient.subscribe(`/topic/game/batak/${currentMatchId}`, (message: any) => {
            const batakEvent = JSON.parse(message.body);
            
            console.debug("BATAK EVENT", batakEvent);

            dataFetch();
        });

        return () => batakSubscription.unsubscribe();
    }, [sessionId, currentMatchId, socketClient]);

    const availableBids = useMemo(() => {
        if (batak?.bid?.value) {
            return Array.from({length: 13-batak.bid.value}, (_, i) => (i+batak.bid.value) + 1)
        } else return [];
    }, [batak]);

    const value = {
        batakId: batak?.id,
        hand: batak?.hand,
        availableCards: batak?.availableCards,
        currentPlayer: batak?.players?.find((p: BatakPlayer) => p.id === player.id) as BatakPlayer,
        rightPlayer: batak?.players?.find((p: BatakPlayer) => p.id === rightPlayer.id) as BatakPlayer,
        topPlayer: batak?.players?.find((p: BatakPlayer) => p.id === topPlayer.id) as BatakPlayer,
        leftPlayer: batak?.players?.find((p: BatakPlayer) => p.id === leftPlayer.id) as BatakPlayer,
        currentMatchScores: batak?.scores,
        bid: batak?.bid,
        availableBids: availableBids,
        trick: batak?.trick || {moves: []},
        turn: batak?.turn,
        status: batak?.status || 'INITIAL',
    }

    if (!sessionId) {
        return <LokalFetchingState />
    }
    else {
        return <BatakContext.Provider value={value}>{children}</BatakContext.Provider>
    }

}