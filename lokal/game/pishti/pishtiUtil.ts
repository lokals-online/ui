import { Card } from "../card/Card";

export interface PishtiSession {
    id: string;
    home: PishtiPlayer;
    away?: PishtiPlayer;
    status: string;
    currentMatchId: string;
    matches: Array<Pishti>;
    settings: PishtiSettings;
}

export interface PishtiPlayer {
    id: string;
    username: string;
    score: number;
}

export interface Pishti {
    id: string;
    remainingCardCount: number;
    hand: Array<Card>;
    capturedCards: Array<Card>;
    pishtis: Array<Card>;
    score: number;
    opponent: PishtiOpponent;
    turn?: string;
    stack: Array<Card>;   
}

export interface PishtiOpponent {
    id: string;
    username: string;
    score: number;
    hand: number;
    capturedCards: Array<Card>;
    pishtis: Array<Card>;
}

export interface PishtiSettings {
    raceTo: number;
    timeLimit?: number;
}