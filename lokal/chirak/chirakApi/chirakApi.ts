import axios from "axios";
import {LOKAL_API_URL, X_LOKAL_TOKEN_HEADER_NAME, X_LOKAL_USER_HEADER_NAME} from "../../common/LokalConstants";
import {Prompt} from "../../yazihane/prompts/Prompt";
import {CurrentPlayer} from "../../player/CurrentPlayer";
import {Masa} from "../../masa/Masa";

export const CHIRAK_API = "/chirak"
const CHIRAK_HELLO_API = `${LOKAL_API_URL}${CHIRAK_API}/hello/`;

export interface HelloResponse {
    player: CurrentPlayer;
    masa: Masa;
    token?: string;
}
export interface PromptResponse {
    key: string;
    responseFor: string;
    prompt: Prompt;
    suggestions: Array<string>;
}

export const chirakApi = {

    hello: async (player: CurrentPlayer) : Promise<HelloResponse> => {

        const config = {
            headers: {
                'x-lokal-user': player.id,
                'Authorization': player?.token,
            }
        }

        return axios.post((CHIRAK_HELLO_API), {}, config)
            .then(response => {

                console.debug("hello response: ", response.data)
                if (response.headers[X_LOKAL_TOKEN_HEADER_NAME] && response.headers[X_LOKAL_USER_HEADER_NAME]) {
                    return {
                        player: response.data.player,
                        masa: response.data.masa,
                        token: response.headers[X_LOKAL_TOKEN_HEADER_NAME],
                    } as HelloResponse;
                }

                return response.data;
            })
            .catch(console.error);
    }
}