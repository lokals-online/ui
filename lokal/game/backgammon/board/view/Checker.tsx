import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { backgammonApi } from "../../../../chirak/chirakApi/game/backgammonApi";
import { Point } from "../../BackgammonContext";
import { LokalText } from "../../../../common/LokalCommons";
import { useBackgammon } from "../../BackgammonProvider";
import { useBackgammonSession } from "../../BackgammonSessionProvider";

interface MovingCheckerProps {
    index: number;
    top: number;
    left: number;
    point: Point; 
    color: string, 
    droppablePoints: Array<Point>;
    setSelectedChecker: (index: number) => void;
    setHighlightedPoint: (index: number) => void;
    pickable: boolean;
}
export const MovingChecker = ({index, top, left, point, color, droppablePoints, setSelectedChecker, setHighlightedPoint, pickable}: MovingCheckerProps) => {

    const {session} = useBackgammonSession();
    const {id, dimensions} = useBackgammon();

    const offset = {x: left, y: top}
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const findTarget = () : Point | undefined => {
        "worklet";
        if (!droppablePoints || droppablePoints.length === 0) return undefined;
        // console.log(droppablePoints)
        const droppedPointX = (left + translateX.value + (dimensions.pieceR/2));
        const droppedPointY = (top + translateY.value + (dimensions.pieceR/2));
        
        return droppablePoints.find((dPoint: Point) => {
            // console.debug(`checking ${dPoint.index}
            //     x:[${dPoint.positionLeft}_${dPoint.positionLeft + dimensions.pointWidth}]
            //     y:[${dPoint.positionTop}_${dPoint.positionTop + dimensions.pointHeight}]`
            // )
            return ((droppedPointX > dPoint.positionLeft) && (droppedPointX < dPoint.positionLeft + dimensions.pointWidth) &&
                (droppedPointY > dPoint.positionTop) && (droppedPointY < dPoint.positionTop + dimensions.pointHeight))
        });
    }

    const panGesture = Gesture.Pan()
        .onStart(() => runOnJS(setSelectedChecker)(point.index))
        .onUpdate((event) => {
            console.debug(event.absoluteX, event.absoluteY)

            translateX.value = (event.translationX);
            translateY.value = (event.translationY);

            // TODO: highlighted possible slot if reaches
            const target = findTarget();
            if (target) runOnJS(setHighlightedPoint)(target.index);
            else runOnJS(setHighlightedPoint)(-1);
        })
        .onEnd((event, success) => {
            if (!success) return;

            runOnJS(setSelectedChecker)(-1);
            runOnJS(setHighlightedPoint)(-1);

            const target = findTarget();
            if (!target) {
                // console.debug("dropped to an invalid point, rejecting...", (point.positionLeft+translateX.value), (point.positionTop + translateY.value));
                // console.table({
                //     "positionLeft": point.positionLeft,
                //     "positionTop": point.positionTop,
                //     "translationX": translateX.value,
                //     "translationY": translateY.value,
                //     "dropped to left": (point.positionLeft + translateX.value + (dimensions.pieceR/2)),
                //     "dropped to top": (point.positionTop+translateY.value + (dimensions.pieceR/2)),
                // })
                translateY.value = withSpring(0);
                translateX.value = withSpring(0);
            }
            else {
                console.debug("successful move", target);
                translateY.value = 0;
                translateX.value = 0;

                runOnJS(backgammonApi.game.move)(session.id, id,[{from: point.index, to: target.index}]);
            }
        });

    const doubleTap = Gesture.Tap().numberOfTaps(2)
        .onEnd((event, success) => {
        if (!success || !pickable) return;
        // pick
        runOnJS(backgammonApi.game.move)(session.id, id,[{from: point.index, to: -1}]);
    });

    const composed = Gesture.Race(panGesture, doubleTap);

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ]
    }));

    return <GestureDetector gesture={composed}>
        <Animated.View style={[{
            position: 'absolute',
            borderRadius: 100,
            borderWidth: 3,
            zIndex: 10,
        }, {
            width: dimensions.pieceR, 
            height: dimensions.pieceR, 
            top: top, left: left, 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color,
        }, style]} >
            {/* {pickable && <LokalSquare style={{color: LOKAL_COLORS.NOT_AVAILABLE, fontSize: 10}} />} */}
            {/* <Text></Text> */}
            {/* <Checker color={color} index={index} top={top} left={left} /> */}
        </Animated.View>
    </GestureDetector>
}

interface HitCheckerProps {
    top: number;
    left: number;
    color: string,
    droppablePoints: Array<Point>;
    setSelectedChecker: (index: number) => void;
    setHighlightedPoint: (index: number) => void;
}
export const HitChecker = ({top, left, color, droppablePoints, setSelectedChecker, setHighlightedPoint}: HitCheckerProps) => {

    const {session} = useBackgammonSession();
    const {id, dimensions} = useBackgammon();

    // const offset = {x: point.positionLeft, y: point.positionTop}
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const findTarget = () : Point | undefined => {
        "worklet";
        const droppedPointX = (left + translateX.value + dimensions.pieceR);
        const droppedPointY = (top + translateY.value + dimensions.pieceR);
        // console.log(`dropped to x:${droppedPointX} y:${droppedPointY}`);

        return droppablePoints.find((dPoint: Point) => {
            // console.log(`checking ${dPoint.index} x:[${dPoint.positionLeft}_${dPoint.positionLeft + pointWidth}] y:[${dPoint.positionTop}_${dPoint.positionTop + pointHeight}]`)
            return ((droppedPointX > dPoint.positionLeft) && (droppedPointX < dPoint.positionLeft + dimensions.pointWidth) &&
                (droppedPointY > dPoint.positionTop) && (droppedPointY < dPoint.positionTop + dimensions.pointHeight))
        });
    }

    const panGesture = Gesture.Pan()
        .onBegin(() => runOnJS(setSelectedChecker)(24))
        .onChange((event) => {
            translateX.value = (event.translationX);
            translateY.value = (event.translationY);

            // TODO: highlighted possible slot if reaches
            const target = findTarget();
            if (target) runOnJS(setHighlightedPoint)(target.index);
            else runOnJS(setHighlightedPoint)(-1);
        })
        .onFinalize((event) => {
            runOnJS(setSelectedChecker)(-1);
            runOnJS(setHighlightedPoint)(-1);

            const target = findTarget();
            if (!target) {
                // console.debug("dropped to an invalid point, rejecting...", translateX, translateY);
                translateY.value = withSpring(0);
                translateX.value = withSpring(0);
            }
            else {
                console.debug("successful move", target);
                translateY.value = 0;
                translateX.value = 0;

                runOnJS(backgammonApi.game.move)(session.id, id, [{from: 24, to: target.index}]);
            }
        });

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
        zIndex: 10000
    }));

    return <GestureDetector gesture={panGesture}>
        <Animated.View style={[{
            position: 'absolute',
            borderRadius: 100,
            borderWidth: 3,
            zIndex: 10,
        }, {width: dimensions.pieceR, height: dimensions.pieceR, top: top, left: left, backgroundColor: color, zIndex: 1000}, style]} >
            {/* <Checker color={color} /> */}
        </Animated.View>
    </GestureDetector>
}

export const Checker = ({multiplier, color, style}: any) => {
    const {dimensions} = useBackgammon();
    return <View style={[{
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'transparent',
        zIndex: 10,
        width: dimensions.pieceR,
        height: dimensions.pieceR,
        backgroundColor: color
    }, style]}>
        <LokalText style={{color: 'red'}}>{multiplier}</LokalText>
    </View>
}