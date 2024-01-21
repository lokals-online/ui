import axios from "axios";
import { LOKAL_API_URL } from "../../../common/LokalConstants";
import { Batak, BatakSession, BatakSettings } from "../../../game/batak/batakUtil";
import { Card } from "../../../game/card/Card";

const BATAK_API = `${LOKAL_API_URL}/batak`;

export const batakApi = {

    session: {
        new: async (settings: BatakSettings): Promise<BatakSession> => {
            return axios
                .post(`${BATAK_API}`, settings)
                .then(response => response.data)
                .catch(console.error);
        },
        fetch: async (id: string): Promise<BatakSession> => {
            return axios
                .get(`${BATAK_API}/${id}`)
                .then(response => response.data as BatakSession);
        },
        sit: async (id: string): Promise<any> => {
            return axios.post(`${BATAK_API}/${id}/sit`)
                .then(response => response.data)
                .catch(console.error)
        },
        restart: async (id: string): Promise<any> => {
            return axios.put(`${BATAK_API}/${id}/restart`)
                .then(response => response.data)
                .catch(console.error)
        }
    },

    game: {
        fetch: async (batakSessionId: string, id: string): Promise<Batak> => {
            return axios
                .get(`${BATAK_API}/${batakSessionId}/game/${id}`)
                .then(response => response.data);
        },
        bid: async (batakSessionId: string, id: string, value: number) => {
            return axios.post(`${BATAK_API}/${batakSessionId}/game/${id}/bid`, value)
                .catch(err => console.error(err));
        },
        chooseBetType: async (batakSessionId: string, id: string, type: string) => {
            return axios.post(`${BATAK_API}/${batakSessionId}/game/${id}/chooseTrump`, type)
                .catch(err => console.error(err));
        },
        play: async (batakSessionId: string, id: string, card: Card) => {
            return axios.post(`${BATAK_API}/${batakSessionId}/game/${id}/play`, card)
                .catch(err => console.error(err));
        }
    }
}