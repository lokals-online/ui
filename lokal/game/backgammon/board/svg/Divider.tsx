import { useEffect } from "react";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import { Path } from "react-native-svg";
import { useBackgammon } from "../../BackgammonContext";

const AnimatedPath = Animated.createAnimatedComponent(Path);
export const Divider = () => {
    
    const {dimensions} = useBackgammon();
    const x = (dimensions.boardWidth/2);
    
    const strokeOffset = useSharedValue(-dimensions.boardWidth);

    useEffect(() => {
        strokeOffset.value = 0;
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        // strokeWidth: withTiming(strokeWidth.value, {duration: 1000}),
        strokeDashoffset: withTiming(strokeOffset.value, {duration: 1000})
    }));

    return (
        <AnimatedPath 
            d={`M ${x},0 V${dimensions.boardWidth}`} 
            animatedProps={animatedProps}
            stroke={'black'}
            strokeWidth={10}
            strokeDasharray={-strokeOffset.value}
        />
    )
}