import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { usePlayer } from "../../../player/Player";
import { useMemo } from "react";
import { Circle, G, Path } from "react-native-svg";
import Animated, { useAnimatedProps, useSharedValue, withSpring } from "react-native-reanimated";
import { Point } from "./Point";
import { boardWidth, pieceR, slotContainerWidth, slotWidth } from "./Board";

interface SlotProps {
    index: number;
    playerId?: string;
    count: number;
    highlighted: boolean;
    setSelectedSlot: (index: number) => void;
}
export const SlotComponent = ({index, playerId, count, highlighted, setSelectedSlot}: SlotProps) => {
    
    const colors = ["#FFC27A", "#7EDAB9", "#45A6E5", "#FE8777"];

    const {player} = usePlayer();
    
    const coords = useMemo(() => {
        const x = (index > 11) ? (((23-index)*slotContainerWidth)) : (((index*slotContainerWidth)));
        const y = (index > 11 ? 0 : boardWidth);
        
        return {
            x: x, 
            y: y, 
            center: (x+(slotContainerWidth/2)),
        }
    }, [boardWidth]);

    return (
        <G key={`slot-g-${index}`}>
            <Point index={index} coords={coords} highlight={highlighted} />
            <Path d={`m${coords.x},${coords.y} h${slotContainerWidth}`} stroke={colors[index%4]} strokeWidth={5} />
            
            {count > 0 &&
                Array.from({length: count}, (_, pIndex) => 
                    <MoveablePiece 
                        key={`slot-${index}-piece-${pIndex}`}
                        slotIndex={index} 
                        x={coords.center} 
                        y={(index > 11 ? (pieceR+(pIndex*slotWidth)) : ((boardWidth-pieceR)-(pIndex*slotWidth)))}
                        r={pieceR}
                        color={playerId === player.id ? player.settings.selfColor : player.settings.opponentColor}
                        setSelectedSlot={setSelectedSlot}
                    />
                )
            }
            
        </G>
    )
}


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PieceProps {
    slotIndex: number;
    x: number;
    y: number;
    r: number;
    color: string;
    setSelectedSlot: (index: number) => void;
}
export const MoveablePiece = ({slotIndex, x, y, r, color, setSelectedSlot}: PieceProps) => {

    const offset = {x: x, y: y}

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            console.log("begin...")
            
            setSelectedSlot(slotIndex);
        })
        .onChange((event) => {
            translateX.value = (offset.x + event.translationX);
            translateY.value = (offset.y + event.translationY);

            // highlighted possible slot if reach

        })
        .onFinalize(() => {
            setSelectedSlot(-1);
            if (translateX.value === 0 && translateY.value === 0) {
                return;
            }
            
            const dx = translateX.value - offset.x;
            const dy = translateX.value - offset.y;



            translateX.value = withSpring(x);
            translateY.value = withSpring(y);
        });

    // const longPressGesture = Gesture.Tap().onStart((_event) => {
    //     console.log("long press started..")
    //     setSelectedSlot(slotIndex);
    // }).onFinalize(() => {
    //     setSelectedSlot(-1);
    // })

    // const composed = Gesture.Race(panGesture, longPressGesture);

    const animatedProps = useAnimatedProps(() => (
        {cx: translateX.value || x, cy: translateY.value || y}
    ));

    return (
        <GestureDetector gesture={panGesture}>
            <AnimatedCircle cx={x} cy={y} fill={color} r={r} animatedProps={animatedProps} />
        </GestureDetector>
    )
}