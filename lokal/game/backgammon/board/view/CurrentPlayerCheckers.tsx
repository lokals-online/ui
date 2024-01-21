import {usePlayer} from "../../../../player/CurrentPlayer";
import {Checker, MovingChecker} from "./Checker";
import {Point, useBackgammon} from "../../BackgammonContext";

interface CurrentPlayerCheckersProps {
    point: Point;
    count: number;
    droppablePoints: Array<Point>,
    setSelectedChecker: (index: number) => void;
    setHighlightedPoint: (index: number) => void;
    pickable: boolean;
}
export const CurrentPlayerCheckers = ({ point, count, droppablePoints, setSelectedChecker, setHighlightedPoint, pickable }: CurrentPlayerCheckersProps) => {

    const { player } = usePlayer();
    const {dimensions} = useBackgammon();

    const calculatePosition = (index: number): {top: number, left: number} => {
        if (point.placement === 'pointTop') {
            return {top: ((point.positionTop) + (index*dimensions.pieceR)), left: point.positionLeft + dimensions.checkerPadding}
        }
        else return {top: ((dimensions.boardHeight-dimensions.pieceR) - (index*dimensions.pieceR)), left: point.positionLeft + dimensions.checkerPadding}
    }

    const moveable = (droppablePoints && droppablePoints.length > 0);

    return (
        <>
            {Array.from({ length: count-1 }, (_, checkerIndex) => {
                const checkerPosition = calculatePosition(checkerIndex);
                return <Checker
                    key={`point-${point.index}-c-${checkerIndex}`}
                    color={player.settings?.selfColor}
                    index={checkerIndex}
                    top={checkerPosition.top}
                    left={checkerPosition.left}
                />}
            )}

            {(moveable || pickable) && <MovingChecker
                point={point}
                index={count-1}
                color={player.settings?.selfColor}
                droppablePoints={droppablePoints}
                setSelectedChecker={setSelectedChecker}
                setHighlightedPoint={setHighlightedPoint}
                pickable={pickable}
                top={calculatePosition(count-1).top}  // TODO: fix shit!
                left={calculatePosition(count-1).left}
            />
            }
            {!(moveable || pickable) && <Checker
                point={point}
                color={player.settings?.selfColor}
                index={count-1}
                top={calculatePosition(count-1).top}  // TODO: fix shit!
                left={calculatePosition(count-1).left}
            />
            }
        </>
    )
}