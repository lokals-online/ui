import { createContext, useContext, useEffect, useState } from "react";
import { Backgammon } from "./backgammonUtil";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import { backgammonApi } from "../../chirak/chirakApi/game/backgammonApi";
import { LokalText } from "../../common/LokalCommons";

export interface BackgammonContextProps {
    backgammon: Backgammon;
}
const BackgammonContext = createContext<BackgammonContextProps>({} as BackgammonContextProps);
export const useBackgammon = () => {
    return useContext(BackgammonContext);
}

export const BackgammonProvider = ({children}: any) => {

    const {player, socketClient} = usePlayer();
    const {session} = useBackgammonSession();

    const [backgammon, setBackgammon] = useState<Backgammon>();

    useEffect(() => {
        
        console.log(`BACKGAMMON sessionId:[${session?.id}] id:[${session?.currentMatch?.id}] , playerId: [${player.id}]`);

        if (!session?.id || !session?.currentMatch?.id || !player?.id) {
            return;
        }

        const dataFetch = async () => {
            const backgammonResult = await backgammonApi.game.fetch(session?.id, session?.currentMatch?.id);
      
            console.debug(`BG fetched:`, backgammonResult);
      
            setBackgammon(backgammonResult);
        };

        dataFetch();

        socketClient.subscribe(`/topic/game/backgammon/${session?.currentMatch?.id}`, (message: any) => {
            const backgammonEvent = JSON.parse(message.body);
            
            console.debug("BG EVENT", backgammonEvent);

            dataFetch();
        });

        () => {
            socketClient.unsubscribe(`/topic/game/backgammon/${session?.currentMatch?.id}`);
        }
    }, [session, socketClient]);

    if (!session) {
        return <LokalText>session yok!</LokalText>
    }
    else {
        return <BackgammonContext.Provider value={{backgammon}}>
            {children}
        </BackgammonContext.Provider>
    }

}