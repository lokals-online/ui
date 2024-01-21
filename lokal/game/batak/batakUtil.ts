import { Player } from "../../player/Player";
import { Card } from "../pishti/pishtiUtil";

export interface BatakSession {
    id: string;
    players: Array<BatakPlayer>;
    settings: BatakSettings;
    currentMatchId: string;
    matches: Array<Batak>;
    scores?: Map<String, number>;
}

export interface Batak {
    id: string;
    hand: Array<Card>;
    availableCards: Array<Card>;
    players: Array<Player>;
    turn: string;
    bid: {playerId: string, value: number, trump?: string}
    status: string;
    trick?: {moves: Array<BatakMove>}
}

export interface BatakMove {
    playerId: string;
    card: Card;
}

export interface BatakPlayer {
    id: string;
    username: string;
    hand: Array<Card>;
    score: number;
}

export interface BatakSettings {
    raceTo: number;
    // timeLimit?: number;
}