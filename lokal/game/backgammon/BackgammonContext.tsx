import {BackgammonPlayer, Move, Turn} from "./backgammonUtil";
import {createContext, useContext} from "react";

export interface Point {
    index: number;
    positionLeft: number;
    positionTop: number;
    placement: 'pointTop' | 'pointBottom'
}

export interface BackgammonContext {
    id: string;
    sessionId: string;
    currentPlayer: BackgammonPlayer;
    opponent: BackgammonPlayer;
    turn: Turn;
    dimensions: BackgammonDimensions;
}

// export const initialContext = {
//     id: null,
//     sessionId: null,
//     currentPlayer: null,
//     opponent: null,
//     turn: null,
//     dimensions: {}
// } as BackgammonContext;
// export const BackgammonGameContext = createContext<BackgammonContext>(initialContext);

// export const useBackgammonGame = () => {

//     return useContext(BackgammonGameContext);
// }