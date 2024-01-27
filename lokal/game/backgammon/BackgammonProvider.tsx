import { createContext, useContext, useEffect, useState } from "react";
import { Backgammon, BackgammonPlayer, BackgammonReport, Move, Turn } from "./backgammonUtil";
import { usePlayer } from "../../player/CurrentPlayer";
import { useBackgammonSession } from "./BackgammonSessionProvider";
import { backgammonApi } from "../../chirak/chirakApi/game/backgammonApi";
import { LokalFetchingState, LokalText } from "../../common/LokalCommons";
import { INNER_WIDTH } from "../../common/LokalConstants";


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

export const useDimensions = (size: number): BackgammonDimensions => {
    const boardWidth = (size);
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

export interface BackgammonContextProps {
    sessionId: string,
    id: string,
    currentPlayer: BackgammonPlayer,
    opponent: BackgammonPlayer,
    turn: Turn,
    status: string,
    possibleMoves: Array<Move>,
    report?: BackgammonReport,
    dimensions: BackgammonDimensions;
}
const BackgammonContext = createContext<BackgammonContextProps>({} as BackgammonContextProps);
export const useBackgammon = () => {
    return useContext(BackgammonContext);
}

export const BackgammonProvider = ({children}: any) => {

    const {player, socketClient} = usePlayer();
    const {session} = useBackgammonSession();

    const [backgammon, setBackgammon] = useState<Backgammon>();

    useEffect(() => {
        
        console.log(`BACKGAMMON sessionId:[${session?.id}] id:[${session?.currentMatch?.id}] , playerId: [${player.id}]`);

        if (!session?.id || !session?.currentMatch?.id || !player?.id || !socketClient) {
            return;
        }

        const dataFetch = async () => {
            const backgammonResult = await backgammonApi.game.fetch(session?.id, session?.currentMatch?.id);
      
            console.debug(`BG fetched:`, backgammonResult);
      
            setBackgammon(backgammonResult);
        };

        dataFetch();

        const backgammonSubscription = socketClient?.subscribe(`/topic/game/backgammon/${session?.currentMatch?.id}`, (message: any) => {
            const backgammonEvent = JSON.parse(message.body);
            
            console.debug("BG EVENT", backgammonEvent);

            dataFetch();
        });

        return () => {
            backgammonSubscription.unsubscribe();
        }
    }, [session, socketClient]);

    const value = {
        sessionId: session?.id,
        id: backgammon?.id,
        currentPlayer: (backgammon?.firstPlayer?.id === player.id) ? backgammon?.firstPlayer : backgammon?.secondPlayer,
        opponent: (backgammon?.firstPlayer?.id === player.id) ? backgammon?.secondPlayer : backgammon?.firstPlayer,
        turn: backgammon?.turn,
        status: backgammon?.status,
        report: backgammon?.report,
        possibleMoves: backgammon?.possibleMoves || [],
        dimensions: {
            boardWidth: INNER_WIDTH,
            boardHeight: INNER_WIDTH,
            barWidth: (INNER_WIDTH/13),
            pointWidth: (INNER_WIDTH/13),
            pointHeight: INNER_WIDTH/2,
            slotWidth: (INNER_WIDTH/13)*0.8,
            pieceR: (INNER_WIDTH/13)*0.8,
            checkerPadding: (((INNER_WIDTH/13) - ((INNER_WIDTH/13)*0.8)) / 2),
            pointPadding: 5
        } as BackgammonDimensions
    }

    if (!session) {
        return <LokalFetchingState />
    }
    else {
        return <BackgammonContext.Provider value={value}>
            {children}
        </BackgammonContext.Provider>
    }

}