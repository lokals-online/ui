import { useNavigation } from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { backgammonApi } from "../../chirak/chirakApi/game/backgammonApi";
import { LokalFetchingState } from "../../common/LokalCommons";
import { usePlayer } from "../../player/CurrentPlayer";
import { BackgammonSession, BackgammonSettings } from "./backgammonUtil";
import { View } from "react-native";

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
    
    const [settings, setSettings] = useState<BackgammonSettings>({raceTo: 2});
    const [opponent, setOpponent] = useState<string>("QR");

    useEffect(() => {
        if (!sessionId || !socketClient?.active) return;

        const dataFetch = async () => {

            const session = await backgammonApi.session.fetch(sessionId)

            console.debug(session);
      
            setBackgammonSession(session);
        };

        dataFetch();

        const bgSessionSubscription = socketClient?.subscribe(`/topic/session/backgammon/${sessionId}`, (message: any) => {
            dataFetch();
        });

        return () => {
            bgSessionSubscription.unsubscribe();
        }
    }, [sessionId, socketClient, reload]);

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
            home: backgammonSession?.home || player,
            away: backgammonSession?.away,
            status: backgammonSession?.status || "INITIAL",
            settings: backgammonSession?.settings || settings,
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

    if (sessionId && !backgammonSession?.id) {
        return <View style={{display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <LokalFetchingState />
        </View>
    }
    else return <BackgammonSessionContext.Provider value={value}>
        {children}
    </BackgammonSessionContext.Provider>;
}
export default BackgammonSessionProvider;