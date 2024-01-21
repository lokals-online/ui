import * as Linking from "expo-linking";
import { useHeaderHeight } from '@react-navigation/elements';
import { usePlayer } from '../../player/CurrentPlayer';
import PishtiSessionProvider from './PishtiSessionProvider';
import { View } from 'react-native';
import { style } from '../../screens/Lokal';
import { useMemo, useState } from 'react';
import { PishtiScoreboard } from './PishtiScoreboard';
import { DEVICE_DIMENSIONS, LOKAL_COLORS, LOKAL_STATUS } from '../../common/LokalConstants';
import PishtiComponent from './Pishti';
import { LokalText } from '../../common/LokalCommons';
import { TableQr } from '../../masa/TableQr';
import { PishtiJoystick } from './PishtiJoystick';
import { PishtiProvider } from "./PishtiProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const Pishti2Screen = ({route, navigation}: any) => {

    const {player, status, socketClient} = usePlayer();
    
    const headerHeight = useHeaderHeight();
    const lokalHeight = useMemo(() => DEVICE_DIMENSIONS.height - headerHeight, [headerHeight]);

    const [qrVisible, setQrVisible] = useState<boolean>(false);

    const sessionId = route?.params?.sessionId;

    return <View style={[style.lokal, {height: (DEVICE_DIMENSIONS.height-headerHeight)}]}>
        <GestureHandlerRootView>
            <PishtiSessionProvider sessionId={sessionId}>

                <PishtiProvider>
                    <View style={[style.yazihane, {height: lokalHeight/4}]}>
                        <PishtiScoreboard />
                    </View>

                    <View style={[style.masa, {
                        height: lokalHeight/2,
                        backgroundColor: (status === LOKAL_STATUS.ONLINE) ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE
                    }]}>
                        {!qrVisible && <PishtiComponent />}
                        {qrVisible && sessionId && <TableQr url={Linking.createURL(`/pishti/${sessionId}`)} />}
                    </View>
                    
                    <View style={[style.joystick, {height: lokalHeight/4}]}>
                        <PishtiJoystick toggleQr={() => setQrVisible(!qrVisible)} />
                    </View>
                </PishtiProvider>

            </PishtiSessionProvider>
        </GestureHandlerRootView>
    </View>
}