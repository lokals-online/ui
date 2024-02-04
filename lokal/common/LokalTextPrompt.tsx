import { useEffect, useState } from "react";
import { LokalText } from "./LokalCommons";

const LokalTextPrompt = ({onEnd, text, style}: any) => {
    const [typedText, setTypedText] = useState("");
  
    const interval = 50;

    const typingRender = (text, updater, interval) => {
        let localTypingIndex = 0;
        let localTyping = "";

        if (text) {
            let printer = setInterval(() => { 
                if (localTypingIndex < text.length) {
                    updater((localTyping += text[localTypingIndex]));
                    localTypingIndex += 1;
                } else {
                    localTypingIndex = 0;
                    localTyping = "";
                    if (onEnd) onEnd(true);
                    clearInterval(printer);
                }
            }, interval);
        }
    };

    useEffect(() => {
        typingRender(text, setTypedText, interval);
    }, [text, interval]);

    return <LokalText style={style}>{typedText}</LokalText>
  }
  
  export default LokalTextPrompt;