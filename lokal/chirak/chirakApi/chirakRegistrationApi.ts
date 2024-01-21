import {CHIRAK_API, HelloResponse} from "./chirakApi";
import {CurrentPlayer} from "../../player/CurrentPlayer";
import axios from "axios";
import {LOKAL_API_URL} from "../../common/LokalConstants";

export const chirakRegistrationApi = {
    hello: async () : Promise<CurrentPlayer> => {
        
        return axios.post(`${LOKAL_API_URL}${CHIRAK_API}/hello`)
            .then(response => {
                if (response.status === 200) return {...response.data.player, token: response.data.token};
                else return {};
            })
            .catch(err => {
                console.error(err)
                return {} as CurrentPlayer;
            });
    },
    login: async (username: string, password: string) : Promise<CurrentPlayer> => {
        return axios.post(`${LOKAL_API_URL}${CHIRAK_API}/login`, {username: username, password: password})
            .then(response => {
                if (response.status === 200) return {...response.data.player, token: response.data.token};
                else return {};
            })
            .catch(err => {
                console.error(err)
                return {} as CurrentPlayer;
            });
    },
    register: async (username: string, password: string) : Promise<boolean> => {
        return axios.post(`${LOKAL_API_URL}${CHIRAK_API}/register`, {username: username, password: password})
            .then(response => {
                if (response.status === 201) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(err => {
                console.error(err)
                return false;
            });
    }
}