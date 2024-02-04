import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { usePlayer } from "../../player/CurrentPlayer";
import { usePishtiSession } from "./PishtiSessionProvider";
import { Pressable, View } from "react-native";
import { Nipple, joystickStyles } from "../backgammon/BackgammonJoyStick";
import { LokalModal, LokalText } from "../../common/LokalCommons";
import { LOKAL_COLORS } from "../../common/LokalConstants";
import { pishtiApi } from "../../chirak/chirakApi/game/pishtiApi";
import { useNavigation } from "@react-navigation/native";
import { usePishti } from "./PishtiProvider";

export const PishtiJoystick = () => {

    const navigation = useNavigation();

    const {player} = usePlayer();

    const {session, newSession, quitSession, reloadSession} = usePishtiSession();

    const [disabled, setDisabled] = useState<boolean>(false);

    const [quitSessionModal, setQuitSessionModal] = useState<boolean>(false);

    return (
        <View style={joystickStyles.box}>
            <View style={{width: '100%', flexDirection: 'row', flex:3}}>
                <View style={joystickStyles.joyStickButton}>
                    {session?.id && session?.status === 'STARTED' && 
                        <Pressable onPress={reloadSession}>
                            <MaterialCommunityIcons name="refresh" size={40} color={LOKAL_COLORS.OFFLINE} />
                        </Pressable>
                    }
                </View>
                <View style={[joystickStyles.joyStickButton, {justifyContent: 'center',alignItems: 'center'}]}>
                    {session?.status === 'INITIAL' && <Nipple text={'basla'} disabled={disabled} onPress={newSession}></Nipple>}

                    {session?.status === 'WAITING' && 
                        player?.id !== session?.home?.id && player?.id !== session?.away?.id &&
                        <Nipple text={'otur'} disabled={disabled} onPress={() => pishtiApi.session.sit(session?.id)}></Nipple>
                    }
                </View>
                <View style={joystickStyles.joyStickButton}>
                    {session && session?.status !== 'INITIAL' && 
                        <Pressable onPress={() => setQuitSessionModal(!quitSessionModal)}>
                            <LokalText style={{color: LOKAL_COLORS.OFFLINE, fontSize: 40}}>X</LokalText>
                        </Pressable>
                    }
                    <LokalModal visible={quitSessionModal} title={'Oyun kapatılsın mı?'} 
                        accept={quitSession} 
                        decline={() => setQuitSessionModal(!quitSessionModal)}
                    />
                </View>
            </View>
        </View>
    );
}