import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../../player/CurrentPlayer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BackgammonSession } from "../backgammon/backgammonUtil";
import { Pishti, PishtiPlayer, PishtiSession, PishtiSettings } from "./pishtiUtil";
import { CHIRAK_PLAYER } from "../../player/Player";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";

export interface PishtiSessionContext {
    session: PishtiSession;
    opponent: string,
    setOpponent: (opp: string) => void;
    reloadSession: () => void;
    newSession: () => Promise<PishtiSession>;
    quitSession: () => void;
    updateSessionSettings: (settings: PishtiSettings) => void;
}
const PishtiSessionContext = createContext<PishtiSessionContext>({} as PishtiSessionContext);
export const usePishtiSession = () => {
    return useContext(PishtiSessionContext);
}

export const PishtiSessionProvider = ({sessionId, children}: any) => {

    const navigation = useNavigation();
    const {player, socketClient} = usePlayer();

    const [reload, setReload] = useState<boolean>(false);
    const [pishtiSession, setPishtiSession] = useState<PishtiSession>();
    
    const home = useMemo<PishtiPlayer>(() => {
        return pishtiSession?.home || {...player, score: 0} as PishtiPlayer;
    }, [pishtiSession]);
    const away = useMemo<PishtiPlayer>(() => {
        return pishtiSession?.away || {...CHIRAK_PLAYER, score: 0} as PishtiPlayer;
    }, [pishtiSession]);
    const status = useMemo<string>(() => (pishtiSession?.status || "INITIAL"), [pishtiSession]);
    
    const [settings, setSettings] = useState<PishtiSettings>(() => (pishtiSession?.settings || {raceTo: 2}));
    const [opponent, setOpponent] = useState<string>(CHIRAK_PLAYER.id);

    useEffect(() => {
        if (!sessionId || pishtiSession?.id) return;
        
        const dataFetch = async () => {

            const session = await pishtiApi.session.fetch(sessionId);

            console.debug(session);
      
            setPishtiSession(session);
        };

        dataFetch();

        socketClient.subscribe(`/topic/session/pishti/${sessionId}`, (message: any) => {
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

        return () => socketClient.unsubscribe(`/topic/session/pishti/${sessionId}`);
    }, [sessionId, pishtiSession, reload, socketClient]);

    const createNewSession = async (): Promise<PishtiSession> => {
        const newSessionResponse = await pishtiApi.session.new(opponent, settings);

        if (newSessionResponse?.id) {
            // navigation.navigate('tavla/'+newSessionResponse.id, { sessionId: newSessionResponse.id });
            navigation.navigate('pishti', {sessionId: newSessionResponse.id})
        }
        else {
            console.error(newSessionResponse);
            return null;
        }
    }

    const updateSessionSettings = (settings: PishtiSettings) => {
        if (pishtiSession?.status !== 'STARTED' && pishtiSession?.status !== 'ENDED') {
            setSettings(settings);
        }
    }

    const quitSession = () => {
        // storageRepository.removeValue(BACKGAMMON_SESSION_ID_KEY);
        if (pishtiSession?.id) {
            setPishtiSession(null);
        }

        navigation.reset({
            index: 0,
            routes: [{ name: 'lokal' }],
        });
    }
    
    // console.debug("backgammon session: ", backgammonSession);

    const value = {
        session: {
            id: pishtiSession ? pishtiSession.id : sessionId,
            home: home,
            away: away,
            status: status,
            settings: settings,
            currentMatchId: pishtiSession?.currentMatchId,
            matches: pishtiSession?.matches
        },
        opponent: opponent,
        setOpponent: setOpponent,
        reloadSession: () => setReload(!reload),
        newSession: createNewSession,
        quitSession: quitSession,
        updateSessionSettings: updateSessionSettings,
    } as PishtiSessionContext;

    return <PishtiSessionContext.Provider value={value}>
        {children}
    </PishtiSessionContext.Provider>;
}
export default PishtiSessionProvider;