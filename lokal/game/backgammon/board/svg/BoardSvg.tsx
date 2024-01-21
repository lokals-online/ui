import Svg from "react-native-svg"
import { Slot } from "../../backgammonUtil"
import { Divider } from "./Divider"
import { useBackgammon } from "../../BackgammonContext"

export const BoardSvg = () => {

    const {dimensions} = useBackgammon();
    return (
        <Svg width={dimensions.boardWidth} height={dimensions.boardHeight} viewBox={`0 0 ${dimensions.boardWidth} ${dimensions.boardHeight}`}>
                
            <Divider />

            {/* {slots.map((slot: Slot, index: number) => 
                <SlotComponent 
                    key={index} 
                    highlighted={highlightedSlots.includes(slot.index)}
                    setSelectedSlot={setSelectedSlot}
                    {...slot} />
            )} */}
        </Svg>
    )
}