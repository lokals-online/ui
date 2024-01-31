import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBatakSession } from "./BatakSessionProvider";
import { Nipple, joystickStyles } from "../backgammon/BackgammonJoyStick";
import { Pressable, View } from "react-native";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { LokalModal, LokalText } from "../../common/LokalCommons";
import { batakApi } from "../../chirak/chirakApi/game/batakApi";
import { BatakPlayer } from "./batakUtil";
import { useBatak } from "./BatakProvider";
import { useNavigation } from "@react-navigation/native";

export const BatakJoystick = ({toggleQr}) => {

    const navigation = useNavigation();
    const {player} = usePlayer();

    const {sessionId, currentPlayer, newSession, quitSession} = useBatakSession();
    const {batakId} = useBatak();

    const [quitSessionModal, setQuitSessionModal] = useState<boolean>(false);

    const [disabled, setDisabled] = useState<boolean>(false);

    const isPlayer = useMemo<boolean>(() => currentPlayer?.id === player?.id, [currentPlayer]);
    const isNew = useMemo<boolean>(() => sessionId === 'new', [sessionId]);
    const qrAvailable = useMemo<boolean>(() => sessionId && sessionId !== 'new' && !batakId, [sessionId, batakId]);

    return (
        <View style={joystickStyles.box}>
            <View style={{width: '100%', flexDirection: 'row', flex:3}}>
                <View style={joystickStyles.joyStickButton}>
                    {/* {qrAvailable && 
                        <Pressable onPress={toggleQr}>
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color={LOKAL_COLORS.OFFLINE} />
                        </Pressable>
                    } */}
                    {batakId && <Pressable onPress={() => navigation.navigate('batak', {sessionId: sessionId})}>
                        <MaterialCommunityIcons name="refresh" size={40} color={LOKAL_COLORS.OFFLINE} />
                    </Pressable>}
                </View>
                <View style={[joystickStyles.joyStickButton, {justifyContent: 'center',alignItems: 'center'}]}>
                    {isNew && <Nipple text={'başla'} disabled={disabled} onPress={() => newSession()}></Nipple>}
                    
                    {sessionId && sessionId !== 'new' && !isPlayer && 
                        <Nipple text={'otur'} disabled={disabled} onPress={() => batakApi.session.sit(sessionId)}></Nipple>
                    }
                </View>
                <View style={joystickStyles.joyStickButton}>
                    <LokalModal visible={quitSessionModal} title={'Oyun kapatılsın mı?'} 
                        accept={quitSession} 
                        decline={() => setQuitSessionModal(!quitSessionModal)}
                    />
                    <Pressable onPress={() => setQuitSessionModal(!quitSessionModal)}>
                        <LokalText style={{color: LOKAL_COLORS.OFFLINE, fontSize: 40}}>X</LokalText>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}