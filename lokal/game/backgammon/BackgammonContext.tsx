import {BackgammonPlayer, Move, Turn} from "./backgammonUtil";
import {createContext, useContext} from "react";
import {Dimensions} from "react-native";

export interface Point {
    index: number;
    positionLeft: number;
    positionTop: number;
    placement: 'pointTop' | 'pointBottom'
}
export interface BackgammonDimensions {
    boardWidth: number,
    boardHeight: number,
    barWidth: number,
    pointWidth: number,
    pointHeight: number,
    slotWidth: number,
    pieceR: number,
    checkerPadding: number,
    pointPadding: number
}
export interface BackgammonContext {
    id: string;
    sessionId: string;
    currentPlayer: BackgammonPlayer;
    opponent: BackgammonPlayer;
    turn: Turn;
    dimensions: BackgammonDimensions;
}

export const useDimensions = (size: number): BackgammonDimensions => {
    const boardWidth = (size); // TODO: 30? !!!!
    const boardHeight = boardWidth;
    const barWidth = (boardWidth/13);
    const pointWidth = (boardWidth-barWidth)/12;
    const pointHeight = boardHeight/2;
    const slotWidth = pointWidth*0.8;
    const pieceR = (slotWidth);
    const checkerPadding = ((pointWidth - pieceR) / 2);

    return {
        boardWidth: boardWidth,
        boardHeight: boardHeight,
        barWidth: barWidth,
        pointWidth: pointWidth,
        pointHeight: pointHeight,
        slotWidth: slotWidth,
        pieceR: pieceR,
        checkerPadding: checkerPadding,
        pointPadding: 5
    } as BackgammonDimensions
}



export const initialContext = {
    id: null,
    sessionId: null,
    currentPlayer: null,
    opponent: null,
    turn: null,
    dimensions: {}
} as BackgammonContext;
export const BackgammonGameContext = createContext<BackgammonContext>(initialContext);

export const useBackgammonGame = () => {

    return useContext(BackgammonGameContext);
}