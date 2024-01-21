import axios from "axios";
import {Backgammon, BackgammonSession, BackgammonSettings, Move} from "../../../game/backgammon/backgammonUtil";
import {CHIRAK_API} from "../chirakApi";
import {LOKAL_API_URL} from "../../../common/LokalConstants";

const BACKGAMMON_API = `${LOKAL_API_URL}/tavla`

export const backgammonApi = {

    session: {
        new: async (opponent: string, settings: BackgammonSettings): Promise<BackgammonSession> => {
            return axios
                .post(`${BACKGAMMON_API}`, {opponent: opponent, settings: settings})
                .then(response => response.data)
                .catch(console.error);
        },
        fetch: async (id: string): Promise<BackgammonSession> => {
            return axios
                .get(`${BACKGAMMON_API}/${id}`)
                .then(response => response.data)
                .catch(console.error);
        },
        sit: async (id: string): Promise<any> => {
            // return axios.post(BACKGAMMON_API_URL + `/${backgammonSessionId}/opponent`)
            return axios.post(`${BACKGAMMON_API}/${id}/sit`)
                .then(response => response.data)
                .catch(console.error)
        },
        rollFirstDie: async (id: string) => {
            return axios.post(`${BACKGAMMON_API}/${id}/firstDie`)
                .catch(err => console.error(err));
        },
        basKonus: async (id: string, form: any) => {

            return axios.post(`${BACKGAMMON_API}/${id}/basKonus`, form, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            .catch(err => console.error(err));
        }
    },

    game: {
        fetch: async (backgammonSessionId: string, backgammonId: string): Promise<Backgammon> => {
            return axios
                .get(`${BACKGAMMON_API}/${backgammonSessionId}/game/${backgammonId}`)
                .then(response => response.data);
        },
        rollDice: async (backgammonSessionId: string, backgammonId: string) => {
            return axios.post(`${BACKGAMMON_API}/${backgammonSessionId}/game/${backgammonId}/rollDice`)
                .catch(err => console.error(err));
        },
        move: async (backgammonSessionId: string, backgammonId: string, moves: Array<Move>) => {
            return axios.post(`${BACKGAMMON_API}/${backgammonSessionId}/game/${backgammonId}/move`, {moves: moves})
                .catch(err => console.error(err));
        }
    }
}