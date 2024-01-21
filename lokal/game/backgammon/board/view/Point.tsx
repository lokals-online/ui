import { useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { LOKAL_COLORS } from "../../../../common/LokalConstants";
import { backgammonApi } from "../../../../chirak/chirakApi/game/backgammonApi";
import { Point, useBackgammonGame } from "../../BackgammonContext";
import { State, TapGestureHandler } from "react-native-gesture-handler";

const colors = ["#FFC27A", "#7EDAB9", "#45A6E5", "#FE8777"];

interface PointProps {
    index: number;
    point: Point;
    isSelected: boolean;
    isMoveable: boolean;
    isTarget: boolean;
    isPickable: boolean;
    selectedPoint: number;
    setSelectedPoint: (index: number) => void;
    children: any;
}
export const PointComponent = ({
    point, 
    isMoveable,
    isSelected,
    isTarget,
    isPickable,
    selectedPoint,
    setSelectedPoint,
    children
}: PointProps) => {

    const {
        id,
        sessionId,
        currentPlayer,
        opponent,
        turn,
        dimensions
    } = useBackgammonGame();

    const ledColor = useMemo(() => {
        if (isSelected) return '#fff';
        if (isTarget) return LOKAL_COLORS.WHITE;
        if (isPickable) return LOKAL_COLORS.WARNING;
    
        return LOKAL_COLORS.OFFLINE;
    }, [isTarget, isMoveable, isPickable, isSelected, selectedPoint]);

    const blinkProgress = useSharedValue(0);
    const blinkStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(blinkProgress.value, [0, 1], [ledColor, 'transparent'])
        }
    });

    useEffect(() => {
        if (turn?.playerId === currentPlayer?.id && (isTarget || isPickable)) {
            blinkProgress.value = withRepeat(withTiming(1, {duration: 500}), -1, true);
        }
        else {
            blinkProgress.value = 0;
        }
    });

    return (
        <View style={[
            {position: 'absolute', display: 'flex', width: '100%', zIndex: 1},
            {top: point.positionTop, left: point.positionLeft, width: dimensions.pointWidth, height: dimensions.pointHeight},
        ]}>
            <PointLed point={point}>
                <Animated.View style={[
                    {display: 'flex', width: '50%', height: '15%', backgroundColor: ledColor},
                    blinkStyle
                ]}>
                </Animated.View>
            </PointLed>
            
            <PointTriangle point={point} isTarget={isTarget} />

            <View style={{
                position: 'absolute', 
                top: 0, left: 0, 
                width: '100%', height: '100%',
                alignItems: 'center', 
                justifyContent: point.placement === 'pointBottom' ? 'flex-end' : 'flex-start',
                rowGap: 2
            }}>
                {turn?.playerId === currentPlayer?.id &&
                    <DoubleTap
                        key={`point-${point.index}`}
                        onSingle={
                            () => {
                                if (!selectedPoint && isMoveable) {
                                    setSelectedPoint(point.index);
                                    return;
                                }
                                if (isSelected) {
                                    setSelectedPoint(null);
                                    return;
                                }
                                if (selectedPoint && isMoveable && !isSelected && !isTarget) {
                                    setSelectedPoint(point.index);
                                    return;
                                }
                                if (isTarget) {
                                    backgammonApi.game.move(sessionId, id, [{from: selectedPoint, to: point.index}]);
                                    setSelectedPoint(null);
                                    return;
                                }
        
                                // TODO: vibrate 
                                console.debug("nothing to do with this point")
                            }
                        }
                        onDouble={() => {
                            if (isPickable) {
                                backgammonApi.game.move(sessionId, id, [{from: point.index, to: -1}]);

                                setSelectedPoint(null);
                            }
                        }}
                    >
                        <View
                            style={[style.pointPressableContainer, {justifyContent: point.placement === 'pointBottom' ? 'flex-end' : 'flex-start'}]}
                        >{children}</View>
                    </DoubleTap>
                }
                {turn?.playerId !== currentPlayer?.id && <View
                    style={[style.pointPressableContainer, {justifyContent: point.placement === 'pointBottom' ? 'flex-end' : 'flex-start'}]}
                >{children}</View>}
            </View>
        </View>
    )
}

const PointLed = ({point, children}: any) => {
    const {dimensions} = useBackgammonGame();
    return (
        <View style={{
            position: 'relative', 
            top: point.placement === "pointTop" ? -dimensions.pointWidth : dimensions.pointHeight,
            justifyContent: point.placement === "pointTop" ? 'flex-end' : 'flex-start',
            width: dimensions.pointWidth, 
            height: dimensions.pointWidth,
            alignItems: 'center',
            zIndex:0,
            // borderWidth: 1,
            // borderColor: '#eaa'
        }}>
            {children}
        </View>
    );
}

const PointTriangle = ({point, isTarget}: any) => {
    const {dimensions} = useBackgammonGame();

    return (
        <View style={{
            width: '100%', 
            height: '100%', 
            position: 'absolute', 
            top:0, 
            left: 0, 
            zIndex:-999
        }}>
            <Svg width={'100%'} height={'100%'}>
                <Path d={`
                    M${dimensions.pointPadding},${point.positionTop} 
                    l${(dimensions.pointWidth-(dimensions.pointPadding*2))/2},${point.placement === 'pointBottom' ? -(dimensions.pointHeight/1.5) : (dimensions.pointHeight/1.5)}
                    l${(dimensions.pointWidth-(dimensions.pointPadding*2))/2},${point.placement === 'pointBottom' ? (dimensions.pointHeight/1.5) : -(dimensions.pointHeight/1.5)}
                    `}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    fill={'#000'}
                    stroke={isTarget ? 'white' : 'transparent'}
                    strokeWidth={1} />
            </Svg>
    </View>);
}

// https://stackoverflow.com/questions/58851295/how-to-differentiate-between-double-tap-and-single-tap-on-react-native
export const DoubleTap = ({children, onSingle, onDouble}: any) => {
    const doubleTapRef = useRef(null);
  
    const onSingleTapEvent = (event: any) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        onSingle();
      }
    };
  
    const onDoubleTapEvent = (event: any) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        onDouble();
      }
    };
  
    return (
      <TapGestureHandler
        onHandlerStateChange={onSingleTapEvent}
        waitFor={doubleTapRef}>
        <TapGestureHandler
          ref={doubleTapRef}
          onHandlerStateChange={onDoubleTapEvent}
          numberOfTaps={2}>
          {children}
        </TapGestureHandler>
      </TapGestureHandler>
    );
  };

const style = StyleSheet.create({
    pointPressableContainer: {
        width: '100%', 
        height: '100%', 
        alignItems: 'center', 
        // borderWidth: 1, 
        // borderColor: '#eee'
    }
});