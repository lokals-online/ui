import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { backgammonApi } from "../../chirak/chirakApi/game/backgammonApi";
import { usePlayer } from "../../player/CurrentPlayer";
import { CHIRAK_PLAYER } from "../../player/Player";
import { storageRepository } from "../../common/storageRepository";
import { Backgammon, BackgammonPlayer, BackgammonSession, BackgammonSettings } from "./backgammonUtil";
import { useLinkTo, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const BACKGAMMON_SESSION_STATE = {
    INITIAL: "INITIAL",
    WAITING: "WAITING",
    STARTED: "STARTED",
    ENDED: "ENDED"
}

export interface BackgammonSessionContext {
    session: BackgammonSession;
    opponent: string,
    setOpponent: (opp: string) => void;
    reloadSession: () => Promise<void>;
    newSession: () => Promise<BackgammonSession>;
    quitSession: () => void;
    updateSessionSettings: (settings: BackgammonSettings) => void;
}
const BackgammonSessionContext = createContext<BackgammonSessionContext>({} as BackgammonSessionContext);
export const useBackgammonSession = () => {
    return useContext(BackgammonSessionContext);
}

const BackgammonSessionProvider = ({sessionId, children}: any) => {

    const navigation = useNavigation();
    const {player, socketClient} = usePlayer();

    const [reload, setReload] = useState<boolean>(false);
    const [backgammonSession, setBackgammonSession] = useState<BackgammonSession>();
    
    const home = useMemo<BackgammonPlayer>(() => {
        return backgammonSession?.home || {...player, score: 0, firstDie: 0} as BackgammonPlayer;
    }, [backgammonSession]);
    const away = useMemo<BackgammonPlayer>(() => {
        return backgammonSession?.away;
    }, [backgammonSession]);
    const status = useMemo<string>(() => (backgammonSession?.status || "INITIAL"), [backgammonSession]);
    
    const [settings, setSettings] = useState<BackgammonSettings>(() => (backgammonSession?.settings || {raceTo: 2}));
    const [opponent, setOpponent] = useState<string>(CHIRAK_PLAYER.id);

    useEffect(() => {
        if (!sessionId || !socketClient.active || !socketClient) return;

        const dataFetch = async () => {

            const session = await backgammonApi.session.fetch(sessionId)

            console.debug(session);
      
            setBackgammonSession(session);
        };

        dataFetch();

        const bgSessionSubscription = socketClient?.subscribe(`/topic/session/backgammon/${sessionId}`, (message: any) => {
            // const sessionEvent = JSON.parse(message.body);

            // if (sessionEvent['type'] === 'SIT') {
            //     console.log("SIT", sessionEvent);

            //     setBackgammonSession(sessionEvent['backgammonSession']);
            // }
            // else if (sessionEvent['type'] === 'QUIT') {
            //     console.log("QUIT", sessionEvent);

            //     setBackgammonSession(sessionEvent['backgammonSession']);
            // }
            // else if (sessionEvent['type'] === 'FIRST_DIE') {
            //     console.log("FIRST_DIE", sessionEvent);

            //     setBackgammonSession(sessionEvent['backgammonSession']);
            // }
            // else if (sessionEvent['type'] === 'START') {
            //     console.log("START", sessionEvent);
            //     console.log("game is starting in 1sec....")
                
            //     setTimeout(() => {
            //         setBackgammonSession(sessionEvent['backgammonSession']);
            //     }, 1000);
            // }
            // else if (sessionEvent['type'] === 'END') {
            //     console.log("ENDED", sessionEvent);

            //     setBackgammonSession(sessionEvent['backgammonSession']);
            // }
            dataFetch();
        });

        return () => {
            bgSessionSubscription.unsubscribe();
        }
    }, [sessionId, socketClient]);

    const createNewSession = async (): Promise<BackgammonSession> => {
        if (!opponent) return null;
        const newSessionResponse = await backgammonApi.session.new(opponent, settings);

        if (newSessionResponse?.id) {
            // navigation.navigate('tavla/'+newSessionResponse.id, { sessionId: newSessionResponse.id });
            navigation.navigate('tavla', {sessionId: newSessionResponse.id})
        }
        else {
            console.error(newSessionResponse);
            return null;
        }
    }

    const updateSessionSettings = (settings: BackgammonSettings) => {
        if (!backgammonSession ||
            backgammonSession?.status === BACKGAMMON_SESSION_STATE.INITIAL || 
            backgammonSession?.status === BACKGAMMON_SESSION_STATE.WAITING
        ) {
            setSettings(settings);
        }
    }

    const quitSession = () => {
        if (backgammonSession?.id) {
            setBackgammonSession(null);
        }

        navigation.reset({
            index: 0,
            routes: [{ name: 'lokal' }],
        });
    }
    
    // console.debug("backgammon session: ", backgammonSession);

    const value = {
        session: {
            id: backgammonSession?.id || 'new',
            home: home,
            away: away,
            status: status,
            settings: settings,
            currentMatch: backgammonSession?.currentMatch,
            matches: backgammonSession?.matches
        },
        opponent: opponent,
        setOpponent: setOpponent,
        reloadSession: () => setReload(!reload),
        newSession: createNewSession,
        quitSession: quitSession,
        updateSessionSettings: updateSessionSettings,
    } as BackgammonSessionContext;

    return <BackgammonSessionContext.Provider value={value}>
        {children}
    </BackgammonSessionContext.Provider>;
}
export default BackgammonSessionProvider;