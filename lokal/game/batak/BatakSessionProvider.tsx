import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LokalFetchingState, LokalText } from "../../common/LokalCommons";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { usePlayer } from "../../player/CurrentPlayer";
import { BatakComponent } from "./Batak";
import { BatakPlayer, BatakSession, BatakSettings } from "./batakUtil";
import { useNavigation } from "@react-navigation/native";

export interface BatakSessionContextProps {
    sessionId: string;
    currentMatchId: string;
    currentPlayer: BatakPlayer;
    rightPlayer: BatakPlayer;
    topPlayer: BatakPlayer;
    leftPlayer: BatakPlayer;
    scores: Map<String, number>;
    settings: BatakSettings;
    sessionStatus: string;
    reloadSession: () => void;
    newSession: () => Promise<BatakSession>;
    quitSession: () => void;
    updateSessionSettings: (settings: BatakSettings) => void;
}
const BatakSessionContext = createContext<BatakSessionContextProps>({} as BatakSessionContextProps);
export const useBatakSession = () => {
    return useContext(BatakSessionContext);
}

export const BatakSessionProvider = ({sessionId, children}: any) => {

    const navigation = useNavigation();
    const {player, socketClient} = usePlayer();

    const [reload, setReload] = useState<boolean>(false);

    const [batakSession, setBatakSession] = useState<BatakSession>();
    const [settings, setSettings] = useState<BatakSettings>({raceTo: 51});
    
    useEffect(() => {

        if (!socketClient || !socketClient.active || !sessionId) return;

        const dataFetch = async () => {

            const session = await batakApi.session.fetch(sessionId);

            console.debug("batak session", session);
      
            setBatakSession(session);
        };

        dataFetch();

        const sessionSubscription = socketClient?.subscribe(`/topic/session/batak/${sessionId}`, (message: any) => {
            const sessionEvent = JSON.parse(message.body);

            console.log("batak session event!", sessionEvent);

            dataFetch();
        });


        return () => {
            sessionSubscription.unsubscribe();
        }
    }, [sessionId, socketClient]);

    useEffect(() => {
        if (batakSession?.settings) {
            setSettings(batakSession.settings);
        }
    }, [batakSession]);

    const createNewSession = async (): Promise<BatakSession> => {
        const newSessionResponse = await batakApi.session.new(settings);

        if (newSessionResponse?.id) {
            // navigation.navigate('tavla/'+newSessionResponse.id, { sessionId: newSessionResponse.id });
            navigation.navigate('batak', {sessionId: newSessionResponse.id})
        }
        else {
            console.error(newSessionResponse);
            return null;
        }
    }

    const updateSessionSettings = (settings: BatakSettings) => {
        if (!batakSession?.currentMatchId) {
            setSettings(settings);
        }
    }

    const quitSession = () => {
        // storageRepository.removeValue(BACKGAMMON_SESSION_ID_KEY);
        if (batakSession?.id) {
            setBatakSession(null);
        }

        navigation.reset({
            index: 0,
            routes: [{ name: 'lokal' }],
        });
    }

    const currentPlayerIndex = useMemo(() => {
        if (batakSession?.players) {
            return batakSession?.players?.findIndex((p: BatakPlayer) => p.id === player.id)
        }
    }, [batakSession, player]);
    const currentPlayer = useMemo<BatakPlayer>(() => {
        if (batakSession?.players) {
            const currentP = batakSession?.players[(currentPlayerIndex)%4];
            return {...currentP, score: batakSession?.scores[currentP?.id]} as BatakPlayer;
        }
    }, [batakSession]);
    const rightPlayer = useMemo<BatakPlayer>(() => {
        if (batakSession?.players) {
            const rightP = batakSession?.players[(currentPlayerIndex+1)%4];
            return {...rightP, score: batakSession?.scores[rightP?.id]} as BatakPlayer;
        }
    }, [batakSession]);
    const topPlayer = useMemo<BatakPlayer>(() => {
        if (batakSession?.players) {
            const topP = batakSession?.players[(currentPlayerIndex+2)%4];
            return {...topP, score: batakSession?.scores[topP?.id]} as BatakPlayer;
        }
    }, [batakSession]);
    const leftPlayer = useMemo<BatakPlayer>(() => {
        if (batakSession?.players) {
            const leftP = batakSession?.players[(currentPlayerIndex+3)%4];
            return {...leftP, score: batakSession?.scores[leftP?.id]} as BatakPlayer;
        }
    }, [batakSession]);

    const value = {
        sessionId: batakSession?.id,
        currentMatchId: batakSession?.currentMatchId,
        currentPlayer: currentPlayer,
        rightPlayer: rightPlayer,
        topPlayer: topPlayer,
        leftPlayer: leftPlayer,
        scores: batakSession?.scores,
        settings: settings,
        sessionStatus: batakSession?.status || 'INITIAL',
        reloadSession: () => setReload(!reload),
        newSession: createNewSession,
        quitSession: quitSession,
        updateSessionSettings: updateSessionSettings,
    };

    if (!sessionId) {
        return <BatakSessionContext.Provider value={{...value, sessionId: 'new', settings: settings}}>
            {children}
        </BatakSessionContext.Provider>
    }
    else if (sessionId && !batakSession?.id) {
        return <LokalFetchingState />
    }
    else return <BatakSessionContext.Provider value={value}>
        {children}
    </BatakSessionContext.Provider>

}