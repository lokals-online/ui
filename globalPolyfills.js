import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions"
import {TextEncoder, TextDecoder} from "text-encoding";

// workaround for the TextEncoder issue with stompjs.

const applyGlobalPolyfills = () => {
    polyfillGlobal("TextEncoder", () => TextEncoder)
    polyfillGlobal("TextDecoder", () => TextDecoder)
}

export default applyGlobalPolyfills