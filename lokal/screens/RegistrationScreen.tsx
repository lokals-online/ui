import { useHeaderHeight } from '@react-navigation/elements';
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { LokalText } from '../common/LokalCommons';
import { DEVICE_DIMENSIONS, INNER_WIDTH, LOKAL_COLORS, LOKAL_STATUS } from "../common/LokalConstants";
import { usePlayer } from "../player/CurrentPlayer";
import { style } from "./LokalScreen";

export const RegistrationScreen = () => {

    const {player, status} = usePlayer();
    
    const headerHeight = useHeaderHeight();
    const lokalHeight = useMemo(() => DEVICE_DIMENSIONS.height - headerHeight, [headerHeight]);

    const fontSize = 20;

    const [username, setUsername] = useState<string>();
    const [passcode, setPasscode] = useState<string>();

    useEffect(() => {
        // if (player?.id) {
        //     setUsername(player.username);
        // }
    }, [player]);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // behavior={'position'}
            // style={{height: '10%'}}
        >
            <View style={[style.lokal, {height: lokalHeight}]}>
                <View style={[style.yazihane, {height: lokalHeight/4,}]}></View>
                
                <View style={[style.masa, { height: (lokalHeight/2),
                    // borderWidth: 1, borderColor: 'pink',
                    backgroundColor: (LOKAL_STATUS.ONLINE === status) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE
                }]}>
                    <View style={{
                        // borderWidth: 3, borderColor: 'pink',
                        width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'
                    }}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <LokalText style={{fontSize: fontSize}}>[</LokalText>
                            <TextInput
                                style={{
                                    fontFamily: 'EuropeanTeletext', width: INNER_WIDTH/2, fontSize: fontSize, color: 'white', textAlign: 'center'
                                    // borderWidth: 3, borderColor: 'pink'
                                }}
                                placeholder="kullanıcı adı"
                                placeholderTextColor={LOKAL_COLORS.ONLINE_FADED}
                                onChangeText={setUsername}
                                defaultValue={username}
                            />
                            <LokalText style={{fontSize: fontSize}}>]</LokalText>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <LokalText style={{fontSize: fontSize}}>[</LokalText>
                            <TextInput
                                style={{
                                    fontFamily: 'EuropeanTeletext', width: INNER_WIDTH/2, fontSize: fontSize, color: 'white', textAlign: 'center'
                                    // borderWidth: 3, borderColor: 'pink'
                                }}
                                placeholder="****"
                                placeholderTextColor={LOKAL_COLORS.ONLINE_FADED}
                                onChangeText={setPasscode}
                                defaultValue={passcode}
                                secureTextEntry={true}
                            />
                            <LokalText style={{fontSize: fontSize}}>]</LokalText>
                        </View>
                    </View>
                    <View style={{
                        // borderWidth: 3, borderColor: 'pink',
                        flexDirection: 'row',
                        width: '100%', flex: 1, justifyContent: 'space-around', alignItems: 'center'
                    }}>
                        {/* <LokalText>[GOOGLE]</LokalText> */}
                        {/* <LokalText>[FACEBOOK]</LokalText> */}
                    </View>
                </View>
                
                <View style={[style.joystick, { height: (lokalHeight/4)}]}>
                    <LokalText>[kaydol]</LokalText>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}