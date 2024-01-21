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
        if (!sessionId || !socketClient) return;
        loadSession()
            .then(res => {
                console.log("session LOADED :::::: ============>", res)
                if (res) {
                    // setId(res.id);
                    setBackgammonSession(res);
                    setSettings(res.settings);
                }
            })
            .catch((err) => {
                console.log(err)
                Alert.alert('HATA!', 'oyun bulunamadı!', [{text: 'OK', onPress: () => quitSession()}]);
            })
    }, [sessionId, socketClient, reload]);

    useEffect(() => {
        if (!backgammonSession || backgammonSession?.id === 'new' || !socketClient) return;

        if (backgammonSession && backgammonSession.status !== 'INITIAL') {
            socketClient.subscribe(`/topic/session/backgammon/${backgammonSession?.id}`, (message: any) => {
                // setReload(true);
                const sessionEvent = JSON.parse(message.body);
    
                if (sessionEvent['type'] === 'SIT') {
                    console.log("SIT", sessionEvent);
    
                    setBackgammonSession(sessionEvent['backgammonSession']);
                }
                else if (sessionEvent['type'] === 'QUIT') {
                    console.log("QUIT", sessionEvent);
    
                    setBackgammonSession(sessionEvent['backgammonSession']);
                }
                else if (sessionEvent['type'] === 'FIRST_DIE') {
                    console.log("FIRST_DIE", sessionEvent);
    
                    setBackgammonSession(sessionEvent['backgammonSession']);
                }
                else if (sessionEvent['type'] === 'START') {
                    console.log("START", sessionEvent);
                    console.log("game is starting in 1sec....")
                    
                    setTimeout(() => {
                        setBackgammonSession(sessionEvent['backgammonSession']);
                    }, 1000);
                }
                else if (sessionEvent['type'] === 'END') {
                    console.log("ENDED", sessionEvent);
    
                    setBackgammonSession(sessionEvent['backgammonSession']);
                }
                // dataFetch();
            });
        }

        // if (backgammonSession?.currentMatch) {
        //     console.debug("==============>  subscribing...........");
        //     socketClient.subscribe(`/topic/game/backgammon/${backgammonSession.currentMatch.id}`, (message: any) => {
        //         const backgammonEvent = JSON.parse(message.body);
        //         const updatedBackgammon = backgammonEvent['backgammon'] as Backgammon;
        //         if (backgammonEvent['type'] === 'START') { // ?
        //             console.debug("START", updatedBackgammon);
        //         }
        //         else if (backgammonEvent['type'] === 'ROLL_DICE') {
        //             console.debug("ROLL_DICE", updatedBackgammon);                    
        //             // setBackgammon(updatedBackgammon);
        //             // setRollingDice(false);
        //         }
        //         else if (backgammonEvent['type'] === 'TURN') {
        //             console.debug("TURN", updatedBackgammon);
        //             // setBackgammon(updatedBackgammon);
        //         }
        //         else if (backgammonEvent['type'] === 'MOVE') {
        //             console.debug("MOVE", updatedBackgammon);
        //             // setBackgammon(updatedBackgammon);
        //             // handleMove(updatedBackgammon);
        //         }
        //         else if (backgammonEvent['type'] === 'GAME_OVER') {
        //             console.debug("GAME OVER", updatedBackgammon);
                    
        //             // gameOver(updatedBackgammon);
        //             // setBackgammon(updatedBackgammon);
        //         }
        //         else {
        //             console.debug("UNKNOWN EVENT:", backgammonEvent)
        //         }

        //         setBackgammonSession({...backgammonSession, currentMatch: updatedBackgammon});
        //     });
        // }

        return () => {
            socketClient.unsubscribe(`/topic/session/backgammon/${backgammonSession?.id}`)
            // socketClient.unsubscribe(`/topic/game/backgammon/${backgammonSession?.currentMatch?.id}`)
        }
    }, [backgammonSession, socketClient]);

    const loadSession = async (): Promise<BackgammonSession> => {
        if (sessionId) {
            return backgammonApi.session.fetch(sessionId);
        }
        return null;
    }

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