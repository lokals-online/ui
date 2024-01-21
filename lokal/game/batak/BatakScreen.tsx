import * as Linking from "expo-linking";
import { useHeaderHeight } from '@react-navigation/elements';
import { usePlayer } from "../../player/CurrentPlayer";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { style } from "../../screens/Lokal";
import { BatakSessionProvider } from "./BatakSessionProvider";
import { BatakScoreboard } from "./BatakScoreboard";
import { BatakComponent } from "./Batak";
import { TableQr } from "../../masa/TableQr";
import { DEVICE_DIMENSIONS, LOKAL_COLORS, LOKAL_STATUS } from "../../common/LokalConstants";
import { LokalText } from "../../common/LokalCommons";
import { BatakJoystick } from "./BatakJoystick";
import { BatakProvider } from "./BatakProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const BatakScreen = ({route, navigation}: any) => {

    const {player, status, socketClient} = usePlayer();
    
    const headerHeight = useHeaderHeight();
    const lokalHeight = useMemo(() => DEVICE_DIMENSIONS.height - headerHeight, [headerHeight]);

    const [qrVisible, setQrVisible] = useState<boolean>(false);

    const sessionId = route?.params?.sessionId;

    console.log("session screen params", sessionId);
    return <View style={[style.lokal, {height: (DEVICE_DIMENSIONS.height-headerHeight)}]}>
        <GestureHandlerRootView>
            <BatakSessionProvider sessionId={sessionId}>
                <BatakProvider>
                    <View style={[style.yazihane, {height: lokalHeight/4}]}>
                        <BatakScoreboard />
                    </View>

                    <View style={[style.masa, {
                        height: lokalHeight/2,
                        backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE
                    }]}>
                        {!qrVisible && <BatakComponent />}
                        {qrVisible && sessionId && <TableQr url={Linking.createURL(`/batak/${sessionId}`)} />}
                    </View>
                    
                    <View style={[style.joystick, {height: lokalHeight/4}]}>
                        <BatakJoystick toggleQr={() => setQrVisible(!qrVisible)} />
                    </View>
                </BatakProvider>
            </BatakSessionProvider>
        </GestureHandlerRootView>
    </View>
}