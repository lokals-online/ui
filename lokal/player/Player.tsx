import {Modal, Pressable, TextInput, View} from "react-native";
import React, { useEffect, useState } from "react";
import {LokalText} from "../common/LokalCommons";
import { usePlayer } from "./CurrentPlayer";
import { BlurView } from "expo-blur";
import { INNER_WIDTH, LOKAL_COLORS } from "../common/LokalConstants";

export interface Player {
    id: string;
    username: string;
}

export const CHIRAK_PLAYER = {id: "chirak", username: "çırak"} as Player;

export const PlayerComponent = ({username}: any) => {
    return <View style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    }}>
        <View style={{
            width: 25,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderRadius: 20,
        }}>
            <LokalText>{username}</LokalText>
        </View>
    </View>
}

export const OpponentProfile = ({opponent}: any) => {

    const {player} = usePlayer();

    return (
        <LokalText style={{color: player.settings.opponentColor}}>
            {opponent?.username || '?'}
        </LokalText>
    )
}

export const CurrentPlayerProfile = () => {

    const {player} = usePlayer();

    const [selfProfileModal, setSelfProfileModal] = useState<boolean>(false);

    return (
        <Pressable style={{flexDirection: 'row'}} onPress={() => setSelfProfileModal(true)}>
            <LokalText>[</LokalText>
            <LokalText style={{color: player?.settings.selfColor}}>
                {player?.username}
            </LokalText>
            <LokalText>]</LokalText>
            <UserProfileModal visible={selfProfileModal} onClose={() => setSelfProfileModal(false)} />
        </Pressable>
    )

}

export const UserProfileModal = ({visible, onClose}: any) => {

    const {player, registerAnonymous} = usePlayer();

    const [username, setUsername] = useState<string>();

    const [registrationStatus, setRegistrationStatus] = useState<boolean>();

    useEffect(() => {
        if (player?.username !== 'oyuncu') {
            setUsername(player.username);
        }
    }, [])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <BlurView tint={'dark'} intensity={100} style={{
                flex: 1, 
                width: '100%',
                height: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <View style={{flexDirection: 'column', justifyContent: 'flex-start', width: INNER_WIDTH}}>
                    {/* <LokalText style={{fontSize: 60, color: LOKAL_COLORS.WHITE}}>isim</LokalText> */}

                    <TextInput
                        style={{
                            fontFamily: 'EuropeanTeletext', 
                            width: INNER_WIDTH, 
                            fontSize: 40, 
                            height: 100, 
                            color: registrationStatus === undefined ? 'white' : (registrationStatus ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.ERROR), 
                            textAlign: 'center'
                        }}
                        placeholder="oyuncu adi"
                        placeholderTextColor={LOKAL_COLORS.OFFLINE}
                        onChangeText={(text: string) => setUsername(text)}
                        autoFocus={true}
                        defaultValue={username}
                        cursorColor={LOKAL_COLORS.ONLINE}
                    />
                </View>
                
                <View style={{flexDirection: 'row'}}>
                    <Pressable onPress={() => registerAnonymous(username).then((registrationResponse) => registrationResponse ? onClose() : setRegistrationStatus(false))}>
                        <LokalText style={{fontSize: 30, color: (username) ? LOKAL_COLORS.ACCEPT : LOKAL_COLORS.ONLINE_FADED}}>[kaydet]</LokalText>
                    </Pressable>
                    <Pressable onPress={onClose}>
                        <LokalText style={{fontSize: 30, color: LOKAL_COLORS.OFFLINE}}>[vazgec]</LokalText>
                    </Pressable>
                </View>
            </BlurView>
        </Modal>
    )
}

export default PlayerComponent;