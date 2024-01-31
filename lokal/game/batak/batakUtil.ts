import { Player } from "../../player/Player";
import { Card } from "../card/Card";

export interface BatakSession {
    id: string;
    currentMatchId: string;
    players: Array<BatakPlayer>;
    settings: BatakSettings;
    matches: Array<Batak>;
    status: string;
    scores?: Map<String, number>;
}

export interface Batak {
    id: string;
    hand: Array<Card>;
    availableCards: Array<Card>;
    players: Array<Player>;
    turn: string;
    scores?: Map<String, number>;
    bid: {playerId: string, value: number, trump?: string}
    status: string; // BIDDING, WAITING_TRUMP, STARTED, ENDED
    trick?: {moves: Array<BatakMove>}
}

export interface BatakMove {
    playerId: string;
    card: Card;
}

export interface BatakPlayer {
    id: string;
    username: string;
    bid: number;
    hand: Array<Card>;
    score: number;
}

export interface BatakSettings {
    raceTo: number;
    // timeLimit?: number;
}