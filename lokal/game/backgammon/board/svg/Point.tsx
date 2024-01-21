import Animated, {  } from "react-native-reanimated";
import { Path } from "react-native-svg";
import { boardHeight, pointWidth } from "../../Backgammon";

const AnimatedPointPath = Animated.createAnimatedComponent(Path);

interface PolygonProps {
    index: number;
    coords: {x: number, y: number};
    highlight: boolean;
}
export const Point = ({index, coords, highlight}: PolygonProps) => {

    // const strokeLength = useSharedValue(1);
    
    // useEffect(() => {
    //   strokeLength.value = 1000;
    // }, []);

    // const animatedProps = useAnimatedProps(() => {
    //     return {
    //         strokeDasharray: [withTiming(strokeLength.value, {duration: 3000}), 1000000]
    //     }
    // });

    const PADDING = 20;
    const innerX = coords.x + PADDING;
    const innerWidth = (pointWidth-(PADDING*2));
    const polygonTop = boardHeight/3;
    
    return <AnimatedPointPath 
        key={`slot-${index}`}
        d={`M${innerX},${coords.y} l${innerWidth/2},${coords.y === 0 ? (polygonTop):(-polygonTop)} l${innerWidth/2},${coords.y === 0 ? (-polygonTop):(polygonTop)}`}
        // d={`M${points[0]['x']} ${points[0]['y']}L${points[1]['x']} ${points[1]['y']}L${points[2]['x']} ${points[2]['y']}`}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
        fill={highlight ? '#c0f49d' : 'transparent'}
        stroke={highlight ? '#48822191': '#eee'}
        strokeWidth={5}
    />
}


{/* <Defs>
    <filter id="glow">
        <feGaussianBlur className="blur" result="coloredBlur" stdDeviation="4"></feGaussianBlur>
        <feMerge>
            <feMergeNode in="coloredBlur"></feMergeNode>
            <feMergeNode in="coloredBlur"></feMergeNode>
            <feMergeNode in="coloredBlur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
    </filter>
</Defs> */}