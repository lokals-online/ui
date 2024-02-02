import { Client, Stomp } from "@stomp/stompjs";
import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import SockJS from "sockjs-client";
import { chirakRegistrationApi } from "../chirak/chirakApi/chirakRegistrationApi";
import {
    AUTHORIZATION_HEADER_NAME,
    LOKAL_API_HOST,
    LOKAL_COLORS,
    LOKAL_STATUS,
    X_LOKAL_USER_HEADER_NAME
} from "../common/LokalConstants";
import { storageRepository } from "../common/storageRepository";
import { LokalsOnlineIntro } from '../screens/Intro';

const CURRENT_PLAYER = '@CurrentPlayer';

export interface CurrentPlayer {
    id: string;
    username: string;
    anonymous: boolean;
    token?: string;
    settings: PlayerSettings;
}

export interface PlayerSettings {
    selfColor: string
    opponentColor: string;
}
export const defaultSettings = {selfColor: LOKAL_COLORS.WHITE, opponentColor: LOKAL_COLORS.OFFLINE} as PlayerSettings;

interface CurrentPlayerContext {
    player: CurrentPlayer;
    status: string;
    changeStatus: (status: string) => void;
    socketClient: Client;
    // login?: (username: string, password: string) => Promise<CurrentPlayer>;
    // register?: (username: string, password: string) => Promise<void>;
    registerAnonymous?: (username: string) => Promise<boolean>;
    reload?: () => void;
}

export const CurrentPlayerContext = createContext<CurrentPlayerContext>({} as CurrentPlayerContext);

export const usePlayer = () => {
    return useContext(CurrentPlayerContext);
}

export const CurrentPlayerProvider = ({assetsLoaded, children}: any) => {

    const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer>();
    const [status, setStatus] = useState<string>(LOKAL_STATUS.ONLINE);
    const [lokalSocketClient, setLokalSocketClient] = useState<Client>();

    useEffect(() => {
        if (!currentPlayer) return;

        try {
            const socket = new SockJS(`${LOKAL_API_HOST}/lokal-ws`)
            const client = Stomp.over(() => socket);

            client.debug = function (str) {
                // console.debug(str);
            };

            client.heartbeat.incoming = 4000;
            client.heartbeat.outgoing = 4000;

            client.reconnect_delay = 5000;

            client.connect(currentPlayer.id, currentPlayer.token, function () {
                setLokalSocketClient(client);
            });

            // TODO: upgrade to new version!
            // const client = new Client({
            //     brokerURL: `${WEBSOCKET_API}:8080/lokal-ws`,
            //     connectHeaders: {
            //         login: player.id,
            //         passcode: player.token,
            //     },
            //     debug: function (str) {
            //         console.debug(str);
            //     },
            //     reconnectDelay: 5000,
            //     heartbeatIncoming: 4000,
            //     heartbeatOutgoing: 4000,
            // });

            // client.activate();
            
            // client.onConnect = function (frame) {
            //     console.log("on connect", frame);
            //     setLokalStompClient(client);
            // };

        } catch (err) {
            console.error(err)
        }
    }, [currentPlayer]);

    useEffect(() => {
        loadPlayer();
    }, [status]);

    const loadPlayer = async (): Promise<void> => {
        const currentPlayerString = await storageRepository.getValueFor(CURRENT_PLAYER);

        if (currentPlayerString) {
            const currentPlayerData = JSON.parse(currentPlayerString);

            updateCurrentPlayer(currentPlayerData);
        }
        else {
            chirakRegistrationApi
            .hello()
            .then(res => {
                    if (!res?.token) return;

                    updateCurrentPlayer(res);
                });
        }
    }

    const updateCurrentPlayer = (currentPlayer: CurrentPlayer) => {
        storageRepository.saveValueFor(CURRENT_PLAYER, JSON.stringify(currentPlayer))

        axios.defaults.headers.post[X_LOKAL_USER_HEADER_NAME] = currentPlayer.id;
        axios.defaults.headers.get[X_LOKAL_USER_HEADER_NAME] = currentPlayer.id;
        axios.defaults.headers.patch[X_LOKAL_USER_HEADER_NAME] = currentPlayer.id;
        axios.defaults.headers.put[X_LOKAL_USER_HEADER_NAME] = currentPlayer.id;
        axios.defaults.headers.post[AUTHORIZATION_HEADER_NAME] = `Bearer ${currentPlayer.token}`;
        axios.defaults.headers.get[AUTHORIZATION_HEADER_NAME] = `Bearer ${currentPlayer.token}`;
        axios.defaults.headers.put[AUTHORIZATION_HEADER_NAME] = `Bearer ${currentPlayer.token}`;
        axios.defaults.headers.patch[AUTHORIZATION_HEADER_NAME] = `Bearer ${currentPlayer.token}`;

        setCurrentPlayer({...currentPlayer, settings: defaultSettings})
    }

    const registerAnonymous = async (username: string): Promise<boolean> => {
        return chirakRegistrationApi
            .registerAnonymous(currentPlayer?.id, username)
            .then(updateResponse => {
                if (updateResponse) {
                    updateCurrentPlayer({...currentPlayer, username: username});

                    return true;
                }
                else {
                    console.error("sorun olustu.");
                    return false;
                }
            })
            .catch(() => {
                console.error("sorun olustu.");
                return false;
            });
    }

    // TODO: obscure password!
    const register = async (username: string, password: string): Promise<void> => {
        chirakRegistrationApi
            .register(username, password)
            .then(isRegistered => {
                if (isRegistered) {
                    login(username, password)
                }
                else console.error("sorun olustu");
            })
            .catch(console.error);
    }
    
    const login = async (username: string, password: string): Promise<CurrentPlayer> => {
        return chirakRegistrationApi
            .login(username, password)
            .then(currentPlayer => {
                if (currentPlayer?.token) {
                    updateCurrentPlayer(currentPlayer)
                    return currentPlayer;
                }
                else {
                    return {} as CurrentPlayer;
                }
            });
    };

    const reload = () => {
        storageRepository.removeValue(CURRENT_PLAYER);

        console.debug("refreshing...");
        loadPlayer();
    }

    const value = {
        player: currentPlayer,
        status: status,
        changeStatus: setStatus,
        socketClient: lokalSocketClient,
        // login: login,
        // register: register,
        registerAnonymous: registerAnonymous,
        reload: reload
    }

    const initialized = useMemo(() => (!currentPlayer || !lokalSocketClient || !assetsLoaded), [assetsLoaded, currentPlayer, lokalSocketClient]);
    const [animationEnded, setAnimationEnded] = useState(false);
    
    useEffect(() => {
        if (initialized) {
            setTimeout(() => {return setAnimationEnded(true)}, 2000);
        }
    }, [initialized]);

    return <CurrentPlayerContext.Provider value={value}>
        {!animationEnded && <LokalsOnlineIntro initialized={initialized} />}
        {animationEnded && children}
    </CurrentPlayerContext.Provider>
}