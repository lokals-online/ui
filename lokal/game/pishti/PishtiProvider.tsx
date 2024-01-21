import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePishtiSession } from "./PishtiSessionProvider"
import { Pishti } from "./pishtiUtil";
import { usePlayer } from "../../player/CurrentPlayer";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";
import { LokalText } from "../../common/LokalCommons";
import { Card } from "../card/Card";

export interface PishtiContext {
    pishti: Pishti;
}
const PishtiContext = createContext<PishtiContext>({} as PishtiContext);
export const usePishti = () => {
    return useContext(PishtiContext);
}

export const PishtiProvider = ({children}: any) => {

    const {player, socketClient} = usePlayer();
    const {session} = usePishtiSession();

    // const pishtiId = useMemo<string>(() => session?.currentMatchId, [session]);
    const [pishti, setPishti] = useState<Pishti>();

    useEffect(() => {
        
        console.log(`PISHTI sessionId:[${session?.id}] id:[${session?.currentMatchId}] , playerId: [${player.id}]`);

        if (!session?.id || !session?.currentMatchId || !player?.id) {
            return;
        }

        const dataFetch = async () => {
            const pishtiResult = await pishtiApi.game.fetch(session?.id, session?.currentMatchId);
      
            console.debug(`PISHTI fetched:`, pishtiResult);
      
            setPishti(pishtiResult);
        };

        dataFetch();

        socketClient.subscribe(`/topic/game/pishti/${session?.currentMatchId}`, (message: any) => {
            const pishtiEvent = JSON.parse(message.body);
            
            console.debug("PISHTI EVENT", pishtiEvent);

            // if (pishtiEvent['type'] === 'CARD_PLAYED') {
            //     setPishti({
            //         ...pishti, 
            //         stack: [...pishti.stack, pishtiEvent['payload'] as Card]
            //     });
            // }
            // else if (pishtiEvent['type'] === 'CHANGE_TURN') {
            //     setPishti({
            //         ...pishti, 
            //         stack: [...pishti.stack, pishtiEvent['payload'] as Card]
            //     });
            // }

            dataFetch();
        });

        () => {
            socketClient.unsubscribe(`/topic/game/pishti/${session?.currentMatchId}`);
        }
    }, [session, socketClient]);

    if (!session) {
        return <LokalText>session yok!</LokalText>
    }
    else {
        return <PishtiContext.Provider value={{pishti}}>
            {children}
        </PishtiContext.Provider>
    }

}