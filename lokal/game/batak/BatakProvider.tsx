import { createContext, useContext, useEffect, useState } from "react";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBatakSession } from "./BatakSessionProvider";
import { Batak } from "./batakUtil";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";

export interface BatakContext {
    batak: Batak;
}
const BatakContext = createContext<BatakContext>({} as BatakContext);
export const useBatak = () => {
    return useContext(BatakContext);
}

export const BatakProvider = ({children}: any) => {

    const {player, socketClient} = usePlayer();
    const {session} = useBatakSession();

    const [batak, setBatak] = useState<Batak>();

    useEffect(() => {
        
        console.debug(`BATAK sessionId:[${session?.id}] id:[${session?.currentMatchId}] , playerId: [${player.id}]`);

        if (!socketClient && !player || !session || !session?.currentMatchId) {
            return;
        }

        const dataFetch = async () => {
            const batakResult = await batakApi.game.fetch(session?.id, session?.currentMatchId)
      
            console.debug(`BATAK fetched:`, batakResult);
      
            setBatak(batakResult);
        };

        dataFetch();

        socketClient.subscribe(`/topic/game/batak/${session?.currentMatchId}`, (message: any) => {
            const batakEvent = JSON.parse(message.body);
            
            console.debug("BATAK EVENT", batakEvent);

            dataFetch();
        });

        return () => socketClient.unsubscribe(`/topic/game/batak/${session?.currentMatchId}`);
    }, [session, socketClient]);

    return <BatakContext.Provider value={{batak}}>{children}</BatakContext.Provider>

}