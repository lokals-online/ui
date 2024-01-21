// import Clipboard from '@react-native-clipboard/clipboard';
import { useEffect } from "react";
import { Alert, Button, Pressable } from "react-native";
import SvgQRCode from "react-native-qrcode-svg";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { INNER_WIDTH, LOKAL_COLORS } from '../common/LokalConstants';
import { LokalText } from '../common/LokalCommons';

export const TableQr = ({url}: any) => {

    const bgProgress = useSharedValue(0);
    // const radiusProgress = useSharedValue(LOKAL_MASA_RADIUS);

    useEffect(() => {
        bgProgress.value = withTiming(1 - bgProgress.value, { duration: 1000 });
        // radiusProgress.value = withTiming(0, { duration: 1000 });

        // () => {
        //     bgProgress.value = withTiming(1 - bgProgress.value, { duration: 1000 });
        // }
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                bgProgress.value,
                [0, 1],
                [LOKAL_COLORS.ONLINE, 'black'],
                'RGB',
                {gamma: 2.2}
            ),
            // borderRadius: radiusProgress.value
        };
    });

    return <Animated.View style={[{ width: '100%', height: '100%'}, animatedStyle]} >
        <SvgQRCode value={url} size={INNER_WIDTH} color={LOKAL_COLORS.ONLINE} backgroundColor={'transparent'} />
        {/* <Pressable onPress={() => console.log("fsaf")} */}
        <Pressable onPress={() => {
            // Clipboard.setString(url);
            console.log(url);
            // Alert.alert('', 'kopyalandı!', [{text: 'OK', onPress: () => console.log('OK Pressed')}]);
        }}
            style={{
                paddingTop: 10,
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignContent: 'space-between',
                alignItems: 'stretch'}}
        >
            {/* <LokalText numberOfLines={1} style={{width: '50%', color: LOKAL_COLORS.OFFLINE}}>{gameUrl}</LokalText> */}
            <LokalText style={{color: LOKAL_COLORS.OFFLINE}} numberOfLines={1}>{url}</LokalText>
            <LokalText style={{width: '50%', alignContent: 'flex-end'}}>[paylaş]</LokalText>
            {/* <Button title=''><LokalText style={{width: '50%', alignContent: 'flex-end'}}>[paylaş]</LokalText></Button> */}
        </Pressable>
    </Animated.View>
}