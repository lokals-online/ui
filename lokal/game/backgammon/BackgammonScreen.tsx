import { useHeaderHeight } from '@react-navigation/elements';
import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { DEVICE_DIMENSIONS, LOKAL_COLORS, LOKAL_STATUS } from '../../common/LokalConstants';
import { TableQr } from '../../masa/TableQr';
import { usePlayer } from "../../player/CurrentPlayer";
import { style } from "../../screens/LokalScreen";
import BackgammonGamePlayComponent from './Backgammon';
import { BackgammonJoystick } from './BackgammonJoyStick';
import { BackgammonProvider } from "./BackgammonProvider";
import { BackgammonScoreboard } from "./BackgammonScoreBoard";
import BackgammonSessionProvider from './BackgammonSessionProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const BackgammonScreen = ({route, navigation}: any) => {

    const {status} = usePlayer();
    
    const headerHeight = useHeaderHeight();
    const lokalHeight = useMemo(() => DEVICE_DIMENSIONS.height - headerHeight, [headerHeight]);
    
    const [qrVisible, setQrVisible] = useState(false);

    const sessionId = route?.params?.sessionId;

    return <View style={[style.lokal, {height: (DEVICE_DIMENSIONS.height-headerHeight)}]}>
        <GestureHandlerRootView>
            <BackgammonSessionProvider sessionId={sessionId}>
                <BackgammonProvider>
                    <View style={[style.yazihane, {height: lokalHeight/4}]}>
                        <BackgammonScoreboard />
                    </View>

                    <View style={[style.masa, {
                        height: lokalHeight/2,
                        backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE
                    }]}>
                        {!qrVisible && <BackgammonGamePlayComponent setQrVisible={setQrVisible} />}
                        {qrVisible && <TableQr url={Linking.createURL(`/tavla/${sessionId}`)} />}
                    </View>
                    
                    <View style={[style.joystick, {height: lokalHeight/4}]}>
                        <BackgammonJoystick toggleQr={() => setQrVisible(!qrVisible)} />
                    </View>
                </BackgammonProvider>

            </BackgammonSessionProvider>
        </GestureHandlerRootView>
    </View>
}