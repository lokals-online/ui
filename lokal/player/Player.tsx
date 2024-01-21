import {View} from "react-native";
import React from "react";
import {LokalText} from "../common/LokalCommons";

export interface Player {
    id: string;
    username: string;
}

export const CHIRAK_PLAYER = {id: "chirak", username: "çırak"} as Player;

export const PlayerComponent = ({username}: any) => {
    return <View style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    }}>
        <View style={{
            width: 25,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderRadius: 20,
        }}>
            <LokalText>{username}</LokalText>
        </View>
    </View>
}

export default PlayerComponent;