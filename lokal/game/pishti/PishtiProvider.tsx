import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePishtiSession } from "./PishtiSessionProvider"
import { Pishti } from "./pishtiUtil";
import { usePlayer } from "../../player/CurrentPlayer";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";
import { LokalFetchingState } from "../../common/LokalCommons";

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

    const [pishti, setPishti] = useState<Pishti>();

    useEffect(() => {
        
        console.log(`PISHTI sessionId:[${session?.id}] id:[${session?.currentMatchId}] , playerId: [${player.id}]`);
        if (!session?.id || !session?.currentMatchId || !player?.id || !socketClient) {
            return;
        }

        const fetchPishti = async () => {
            const pishtiResult = await pishtiApi.game.fetch(session?.id, session?.currentMatchId);
      
            console.debug(`PISHTI fetched:`, pishtiResult);
      
            setPishti(pishtiResult);
        };

        fetchPishti();

        const pishtiSubscription = socketClient.subscribe(`/topic/game/pishti/${session?.currentMatchId}`, (message: any) => {
            console.log(message)
            const pishtiEvent = JSON.parse(message.body);
            
            console.debug("PISHTI EVENT", pishtiEvent);

            fetchPishti();
        });

        return () => {
            pishtiSubscription.unsubscribe();
        }
    }, [session, socketClient]);

    if (!session) {
        return <LokalFetchingState />
    }
    else {
        return <PishtiContext.Provider value={{pishti}}>
            {children}
        </PishtiContext.Provider>
    }

}