import axios from "axios";
import { LOKAL_API_URL } from "../../../common/LokalConstants";
import { Pishti, PishtiSession, PishtiSettings } from "../../../game/pishti/pishtiUtil";
import { Card } from "../../../game/card/Card";

const PISHTI_API = `${LOKAL_API_URL}/pishti`;

export const pishtiApi = {

    session: {
        new: async (opponent: string, settings: PishtiSettings): Promise<PishtiSession> => {
            return axios
                .post(`${PISHTI_API}`, {opponent: opponent, settings: settings})
                .then(response => response.data)
                .catch(console.error);
        },
        fetch: async (id: string): Promise<PishtiSession> => {
            return axios
                .get(`${PISHTI_API}/${id}`)
                .then(response => response.data)
                .catch(console.error);
        },
        sit: async (id: string): Promise<any> => {
            return axios.post(`${PISHTI_API}/${id}/sit`)
                .then(response => response.data)
                .catch(console.error)
        }
    },

    game: {
        fetch: async (pishtiSessionId: string, id: string): Promise<Pishti> => {
            return axios
                .get(`${PISHTI_API}/${pishtiSessionId}/game/${id}`)
                .then(response => response.data);
        },
        play: async (pishtiSessionId: string, id: string, card: Card) => {
            return axios.post(`${PISHTI_API}/${pishtiSessionId}/game/${id}`, {card: card})
                .catch(err => console.error(err));
        }
    }
}