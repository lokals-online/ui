import Clipboard from '@react-native-clipboard/clipboard';
import { useEffect } from "react";
import { Alert, Platform, Share, TouchableOpacity } from "react-native";
import SvgQRCode from "react-native-qrcode-svg";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LokalText } from '../common/LokalCommons';
import { INNER_WIDTH, LOKAL_COLORS } from '../common/LokalConstants';

export const TableQr = ({url}: any) => {

    const bgProgress = useSharedValue(0);

    useEffect(() => {
        bgProgress.value = withTiming(1 - bgProgress.value, { duration: 1000 });
    }, []);

    const onShare = async () => {
        try {
          const result = await Share.share({
            title: url,
            message: url,
            url: url
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error: any) {
          Alert.alert(error.message);
        }
    };

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
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
            if (Platform.OS === 'web') {
                Clipboard.setString(url);
            }
            else {
                onShare();
            }
        }}><LokalText>[paylas]</LokalText></TouchableOpacity>
    </Animated.View>
}