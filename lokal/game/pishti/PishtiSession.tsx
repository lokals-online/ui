import { useEffect, useState } from "react";
import { LokalText } from "../../common/LokalCommons";
import { useLokal } from "../../LokalContext";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";
import { usePlayer } from "../../player/CurrentPlayer";
import PishtiComponent from "./Pishti";
import { PishtiSession } from "./pishtiUtil";

export const PishtiSessionComponent = ({id, masaSize, requestRematch}: any) => {

    const {player, socketClient} = usePlayer();
    const {setPrompt} = useLokal();

    if (!socketClient) return <LokalText>soket bekleniyor..</LokalText>

    const [pishtiSession, setPishtiSession] = useState<PishtiSession>();

    useEffect(() => {
        console.log(pishtiSession);
        console.log(pishtiSession?.away === null);
        console.log(pishtiSession?.home?.id !== player.id);
        if (pishtiSession && 
            pishtiSession?.away === null && 
            pishtiSession?.home?.id !== player.id
        ) {
            console.log(pishtiSession);
            setPrompt({value: () => pishtiApi.session.sit(id), key: "#otur"})
        }
    }, [pishtiSession])
    
    useEffect(() => {

        if (!socketClient || !id) return;

        const dataFetch = async () => {

            const session = await pishtiApi.session.fetch(id);

            console.debug(session);
      
            setPishtiSession(session);
        };

        dataFetch();

        socketClient.subscribe(`/topic/session/pishti/${id}`, (message: any) => {
            const sessionEvent = JSON.parse(message.body);

            console.debug("pishti session event!", sessionEvent);

            if (sessionEvent['type'] === 'SIT') {
                console.debug("SIT", sessionEvent);

                // setPishtiSession(sessionEvent['pishtiSession']);
            }
            else if (sessionEvent['type'] === 'QUIT') {
                console.debug("QUIT", sessionEvent);

                // setPishtiSession(sessionEvent['pishtiSession']);
            }
            else if (sessionEvent['type'] === 'START') {
                console.debug("START", sessionEvent);
                console.debug("game is starting in 1sec....")
                
                setTimeout(() => {
                    dataFetch();
                }, 1000);
            }
            else if (sessionEvent['type'] === 'END') {
                console.debug("ENDED", sessionEvent);
            }
            dataFetch();
        });

        return () => socketClient.unsubscribe(`/topic/session/pishti/${id}`);
    }, [id, socketClient]);

    return (
        <>
            {(pishtiSession?.status === 'STARTED') && 
                <PishtiComponent 
                    pishtiSessionId={pishtiSession.id} 
                    id={pishtiSession.currentMatch.id} />
            }
            {(pishtiSession?.status === 'ENDED') && <LokalText>ENDED</LokalText>}
        </>
    );

}