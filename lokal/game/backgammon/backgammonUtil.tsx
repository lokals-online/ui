import { Player } from "../../player/Player";

export interface BackgammonSession {
    id: string;
    home: BackgammonPlayer;
    away?: BackgammonPlayer;
    status: string;
    currentMatch?: Backgammon;
    matches?: Array<Backgammon>;
    settings: BackgammonSettings;
}

export interface BackgammonSettings {
    raceTo: number;
    // timeLimit?: number;
}

export interface Backgammon {
    id: string;
    firstPlayer: BackgammonPlayer;
    secondPlayer?: BackgammonPlayer;
    turn?: Turn;
    possibleMoves?: Move[];
    status?: string; //"WAITING_PLAYERS" | "WAITING_FIRST_DICES" | "STARTING" | "STARTED" | "ENDED";
    report?: BackgammonReport; 
    
}

export class BackgammonReport {
    winner: string;
    isMars: boolean;
    status: string;

    constructor(winner: string, isMars: boolean, status: string) {
        this.winner = winner;
        this.isMars = isMars;
        this.status = status;
    }
}

export interface BackgammonPlayer {
    id: string;
    username: string;
    score: number;
    checkers?: {};
    hitCheckers?: number;
    firstDie: number;
}

export interface Slot {
    playerId: string;
    index: number;
    count: number;
}

export type Turn = {
    playerId: string;
    dices: Array<number> | null;
    moves: Array<Move> | [];
    remainingDices: Array<number>
}

export type Move = {
    from: number;
    to: number;
}

export type BackgammonAction = {
    gameId: string;
    playerId: string;
    type: 'ROLL_DICE' | 'MOVE';
    payload: any;
}

interface PlayerSettings {}
interface BackgammonPlayerSettings extends PlayerSettings {
    pieceColor: string,
    opponentColor: string,
    direction: Direction
}
enum Direction {left,right}