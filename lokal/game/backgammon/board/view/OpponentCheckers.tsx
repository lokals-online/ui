import {usePlayer} from "../../../../player/CurrentPlayer";
import {Checker} from "./Checker";
import {useBackgammon} from "../../BackgammonContext";

export const OpponentCheckers = ({ point, count }: any) => {

    const { player } = usePlayer();
    const {dimensions} = useBackgammon();

    const calculatePosition = (index: number): {top: number, left: number} => {
        if (point.placement === 'pointTop') {
            return {top: ((point.positionTop) + (index*(dimensions.pieceR))), left: point.positionLeft + dimensions.checkerPadding}
        }
        else return {top: ((dimensions.boardHeight-dimensions.pieceR) - (index*(dimensions.pieceR))), left: point.positionLeft + dimensions.checkerPadding}
    }

    return (
        <>
            {Array.from({ length: count }, (_, checkerIndex) => {
                const checkerPosition = calculatePosition(checkerIndex);
                return <Checker
                    key={`point-${point.index}-oppC-${checkerIndex}`}
                    color={player.settings.opponentColor}
                    index={checkerIndex}
                    top={checkerPosition.top}
                    left={checkerPosition.left}
                />}
            )}
        </>
    )
}