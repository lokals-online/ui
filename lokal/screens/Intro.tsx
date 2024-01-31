import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut, FadeOutLeft, Layout, LightSpeedOutLeft, SlideInLeft, SlideInRight, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import { LokalText } from "../common/LokalCommons";
import { LOKAL_COLORS } from "../common/LokalConstants";

const INTRO_FONT_SIZE = 20;
export const LokalsOnlineIntro = ({initialized}: any) => {
    
    const squareBlinkProgress = useSharedValue(1);
    const squareBlinkStyle = useAnimatedStyle(() => {
        return {opacity: squareBlinkProgress.value}
    });

    useEffect(() => {
        squareBlinkProgress.value = withRepeat(withTiming(0.6, {duration: 200}), (initialized ? 1 : -1), true);
    }, [initialized]);

    return <View style={{backgroundColor: '#000', flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Lokals />
            
            <Animated.Text style={[
				{fontFamily: 'EuropeanTeletext', fontSize: INTRO_FONT_SIZE, color: LOKAL_COLORS.ONLINE}, 
				squareBlinkStyle
			]}>&#9632;</Animated.Text>
            
            <Online />
        </View>
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
    	opacity.value = withDelay(500, withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) }));
    	translateX.value = withDelay(500, withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) }));
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
      opacity.value = withDelay(1000, withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) }));
      translateX.value = withDelay(1000, withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) }));
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