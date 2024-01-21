import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LokalText } from "../../common/LokalCommons";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { usePlayer } from "../../player/CurrentPlayer";
import { BatakComponent } from "./Batak";
import { BatakPlayer, BatakSession, BatakSettings } from "./batakUtil";
import { useNavigation } from "@react-navigation/native";

export interface BatakSessionContextProps {
    session: BatakSession;
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

    if (!socketClient) {
        console.warn(socketClient, "is undefined");
        return;
    }

    const [batakSession, setBatakSession] = useState<BatakSession>({id: 'new', settings: {raceTo: 51}} as BatakSession);
    const [settings, setSettings] = useState<BatakSettings>();
    
    useEffect(() => {

        if (!socketClient || !sessionId) return;

        const dataFetch = async () => {

            const session = await batakApi.session.fetch(sessionId);

            console.debug(session);
      
            setBatakSession(session);
        };

        socketClient.subscribe(`/topic/session/batak/${sessionId}`, (message: any) => {
            const sessionEvent = JSON.parse(message.body);

            console.debug("batak session event!", sessionEvent);

            setBatakSession(sessionEvent['batakSession']);
        });

        dataFetch();

        return () => socketClient.unsubscribe(`/topic/session/batak/${sessionId}`);
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

    const value = {
        session: {
            ...batakSession,
            settings: settings
        },
        reloadSession: () => setReload(!reload),
        newSession: createNewSession,
        quitSession: quitSession,
        updateSessionSettings: updateSessionSettings,
    };

    return <BatakSessionContext.Provider value={value}>
        {children}
    </BatakSessionContext.Provider>
    // return (batakSession && <BatakComponent batakSessionId={sessionId} id={batakSession.currentMatch?.id} />);

}