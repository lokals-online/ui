import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Client, Stomp } from "@stomp/stompjs";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ImageBackground, Pressable, View } from "react-native";
import SockJS from "sockjs-client";
import { LokalFetchingState, LokalSquare, LokalText } from "../common/LokalCommons";
import {
    AUTHORIZATION_HEADER_NAME,
    LOKAL_API_HOST,
    LOKAL_COLORS,
    LOKAL_STATUS,
    X_LOKAL_USER_HEADER_NAME
} from "../common/LokalConstants";
import { chirakRegistrationApi } from "../chirak/chirakApi/chirakRegistrationApi";
import { storageRepository } from "../common/storageRepository";
import { LokalsOnlineBar } from '../common/LokalsOnlineBar';
import { BasKonus } from '../common/BasKonus';

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
export const defaultSettings = {selfColor: 'white',opponentColor: LOKAL_COLORS.OFFLINE} as PlayerSettings;

interface CurrentPlayerContext {
    player: CurrentPlayer;
    status: string;
    changeStatus: (status: string) => void;
    socketClient: Client;
    login?: (username: string, password: string) => Promise<CurrentPlayer>;
    register?: (username: string, password: string) => Promise<void>;
    reload?: () => void;
}

export const CurrentPlayerContext = createContext<CurrentPlayerContext>({} as CurrentPlayerContext);

export const usePlayer = () => {
    return useContext(CurrentPlayerContext);
}

export const CurrentPlayerProvider = ({children}: any) => {

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
        login: login,
        register: register,
        reload: reload
    }

    if (!currentPlayer || !lokalSocketClient) {
        return <View style={{flex: 1, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Pressable onPress={() => reload()}>
                <LokalFetchingState />
            </Pressable>
        </View>
    }
    else return <CurrentPlayerContext.Provider value={value}>{children}</CurrentPlayerContext.Provider>
}