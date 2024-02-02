import { useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, FadeOut, Layout, SlideInLeft, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { LOKAL_COLORS } from "../common/LokalConstants";

const INTRO_FONT_SIZE = 20;
const ANIMATION_DELAY = 1000;
const ANIMATION_DURATION = 500;

export const LokalsOnlineIntro = ({initialized}: any) => {
    
    const squareBlinkProgress = useSharedValue(1);
    const squareFontSizeProgress = useSharedValue(INTRO_FONT_SIZE);
    
    const squareStyle = useAnimatedStyle(() => {
        return {
          opacity: squareBlinkProgress.value,
          fontSize: squareFontSizeProgress.value
        }
    });

	squareBlinkProgress.value = withRepeat(withTiming(0.6, {duration: 200}), (-1), true);

    return <View style={{backgroundColor: '#000', flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <Animated.View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Lokals />
            
            <Animated.Text style={[
              {fontFamily: 'EuropeanTeletext', color: LOKAL_COLORS.ONLINE}, 
              squareStyle
            ]}>&#9632;</Animated.Text>
            
            <Online />
        </Animated.View>
    </View>
}

const Lokals = () => {
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(500);
  
    // Animated styles
    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ translateX: translateX.value }],
      };
    });
  
    useEffect(() => {
    	opacity.value = withDelay(ANIMATION_DELAY, withTiming(1, { duration: ANIMATION_DURATION, easing: Easing.out(Easing.exp) }));
    	translateX.value = withDelay(ANIMATION_DELAY, withTiming(0, { duration: ANIMATION_DURATION, easing: Easing.out(Easing.exp) }));
    }, []);


    return <View style={{overflow: 'hidden'}}>
        <Animated.Text style={[{fontFamily: 'EuropeanTeletext', fontSize: INTRO_FONT_SIZE, color: LOKAL_COLORS.WHITE}, animatedStyles]}>
            LOKALS
        </Animated.Text>
    </View>
}

const Online = () => {
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(-500);
  
    // Animated styles
    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{translateX: translateX.value}],
      };
    });
  
    useEffect(() => {
      opacity.value = withDelay(ANIMATION_DELAY, withTiming(1, { duration: ANIMATION_DURATION, easing: Easing.out(Easing.exp) }));
      translateX.value = withDelay(ANIMATION_DELAY, withTiming(0, { duration: ANIMATION_DURATION, easing: Easing.out(Easing.exp) }));
    }, []);


    return <View style={{overflow: 'hidden'}}>
        <Animated.Text style={[{fontFamily: 'EuropeanTeletext', fontSize: INTRO_FONT_SIZE, color: LOKAL_COLORS.ONLINE}, animatedStyles]}>
            ONLINE
        </Animated.Text>
    </View>
}

const AnimatedText = ({children}) => {
    // Shared values for opacity and translateX
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(-50);
  
    // Animated styles
    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ translateX: translateX.value }],
      };
    });
  
    useEffect(() => {
      opacity.value = withDelay(1000, withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) }));
      translateX.value = withDelay(1000, withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }));
    }, []);
  
    return (
      <Animated.Text style={[animatedStyles]}>
        {children}
      </Animated.Text>
    );
};

const AnimatedTest = () => {
    // return (
    //   <Animated.Text 
    //     key={'asdasd'}
    //     entering={SlideInLeft.delay(200).duration(1000).easing(Easing.exp)}
    //     exiting={FadeOut.delay(100).duration(1000)}
    //     style={{ fontSize: 24, color: 'white' }}
    //   >
    //     Hello, Animated Text!
    //   </Animated.Text>
    // );

    return <Animated.View
            key="fede3"  // add this
            entering={SlideInLeft.delay(100).duration(300)}
            exiting={FadeOut}
            layout={Layout.duration(2000).delay(200)}
          >
           <View 
              key="view1"  // add this
              style={{width:50, height: 50, backgroundColor: 'pink'}}>
           </View>
       </Animated.View>
};