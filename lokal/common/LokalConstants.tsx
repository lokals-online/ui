import axios from "axios";
import { Dimensions } from "react-native";

export const LOKAL_API_HOST = process.env.EXPO_PUBLIC_LOKAL_API;
export const WEBSOCKET_API = LOKAL_API_HOST;
console.debug("LOKAL_API_HOST: ", LOKAL_API_HOST)
export const LOKAL_API_URL = `${LOKAL_API_HOST}`;

export const X_LOKAL_USER_HEADER_NAME = 'x-lokal-user';
export const X_LOKAL_TOKEN_HEADER_NAME = 'x-lokal-token';
export const AUTHORIZATION_HEADER_NAME = 'Authorization';

export const LOKAL_DEFAULT_FONT_SIZE = 15;
export const LOKAL_MASA_RADIUS = 8;

export const DEVICE_DIMENSIONS = Dimensions.get("window");
const deviceAspectRatio = DEVICE_DIMENSIONS.width/DEVICE_DIMENSIONS.height;
export const DEVICE_RATIO = deviceAspectRatio < 0.6 ? deviceAspectRatio : 0.5;
export const INNER_WIDTH = DEVICE_DIMENSIONS.height * DEVICE_RATIO;


export const LOKAL_BOARD_TYPES = {
    '52': '52',
    'tavla': 'tavla'
};
// export const GAMES =
export const LOKAL_GAMES = {
    BACKGAMMON: {
        key: 'backgammon',
        url: 'tavla',
        name: 'tavla',
        type: 'tavla'
    },
    PISHTI: {
        key: 'pishti',
        url: 'pishti',
        name: 'pishti',
        type: '52'
    },
    BATAK: {
        key: 'batak',
        url: 'batak',
        name: 'batak',
        type: '52'
    }
}

export const LOKAL_STATUS = {
    ONLINE: 'ONLINE',
    CONNECTING: 'CONNECTING',
    OFFLINE: 'OFFLINE'
}

export const LOKAL_COLORS = {
    ONLINE: '#008545',
    ONLINE_FADED: '#004925',
    WARNING: '#D17818',
    WARNING_FADED: '#7A4619',
    OFFLINE: '#787878',
    WHITE: '#C8C8C8',

    CARD_RED: '#d05315',
    CARD_BLACK: '#787878',

    ACCEPT: '#2fd416',
    DECLINE: '#f95e5e'
}

// OFFLINE: '#C8C8C8',

// WHITE: '#fff',
// ONLINE: '#008000',
// ONLINE_FADED: '#2D492DFF',
// OFFLINE: '#787878',
// WARNING: '#dd7409ff',
// WARNING_FADED: '#dd7409aa',
// ERROR: '#9f4444',
// NOT_AVAILABLE: '#9f4444',
// JOYSTICK_ACTIVE: '#008000',
// ACCEPT: '#2fd416',
// DECLINE: '#f95e5e',
// SELECTED_OPTION: '#ebf7eb',

// 008545 yeşil
// 004925 koyu yeşil (faded)
// D17818 turuncu
// 7A4619 turuncu faded
// 00FF00 accept
// FF0000 decline
// C8C8C8 gri
// 787878 koyu gri

// move to settings
axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.headers.post[X_LOKAL_TOKEN_HEADER_NAME] = '';
axios.defaults.headers.post[X_LOKAL_USER_HEADER_NAME] = '';