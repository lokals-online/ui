import React, { useEffect, useState } from "react"
import { Alert, Animated, Modal, Pressable, Text, StyleSheet, View } from "react-native"
import { LokalText, LokalTextBlink } from "./LokalCommons"
import { LOKAL_STATUS, LOKAL_COLORS, LOKAL_DEFAULT_FONT_SIZE } from "./LokalConstants"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayer } from "../player/CurrentPlayer";
import { BlurView } from "expo-blur";

export const LokalsOnlineBar = ({navigation}: any) => {

    const {status, changeStatus, reload} = usePlayer();

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View style={{flexDirection: 'row',justifyContent: 'center'}}>
            <LokalText>LOKALS</LokalText>
            <LokalText style={{marginLeft: 2, marginRight: 2, color: status === LOKAL_STATUS.ONLINE ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}}>&#9632;</LokalText>
            <LokalText style={{color: status === LOKAL_STATUS.ONLINE ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}}>ONLINE</LokalText>
            {/* <View style={[{alignItems: 'flex-end',justifyContent: 'center'}]}>
                <LokalText>LOKALS</LokalText>
            </View>
            <MaterialCommunityIcons 
                name="square-rounded" 
                size={LOKAL_DEFAULT_FONT_SIZE} 
                color={status === LOKAL_STATUS.ONLINE ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE} 
                style={{backgroundColor: 'transparent'}} 
            />

            <View style={[{justifyContent: 'center', alignItems: 'flex-start'}]}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <LokalText style={{color: status === LOKAL_STATUS.ONLINE ? LOKAL_COLORS.ONLINE : LOKAL_COLORS.OFFLINE}}>{status}</LokalText>
                </Pressable>

                <Modal animationType="fade" transparent={true} visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <BlurView intensity={80} tint={'dark'} style={{
                        flex: 1, 
                        width: '100%', 
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Pressable style={{position: 'absolute', bottom: 100}} onPress={() => setModalVisible(false)}>
                            <LokalText style={{fontSize: 24}}>[X]</LokalText>
                        </Pressable>
                        <Pressable onPress={() => {
                            changeStatus(LOKAL_STATUS.ONLINE);
                            setModalVisible(false);
                        }}>
                            <LokalText style={[style.mainMenuItem, {color: LOKAL_COLORS.ONLINE}]}>[ONLINE]</LokalText>
                        </Pressable>
                        <Pressable onPress={() => {
                            changeStatus(LOKAL_STATUS.OFFLINE);
                            setModalVisible(false);
                        }}>
                            <LokalText style={[style.mainMenuItem, {color: '#6e6b6b'}]}>[OFFLINE]</LokalText>
                        </Pressable>
                        <Pressable onPress={() => {
                            reload()
                            setModalVisible(false);
                        }}>
                            <LokalText style={[style.mainMenuItem, {color: LOKAL_COLORS.WARNING_FADED}]}>[KAPAT AÇ]</LokalText>
                        </Pressable>
                    </BlurView>
                </Modal>
            </View> */}
        </View>
    )
}

const style = StyleSheet.create({
    lokalBarItem: {
        flexBasis: 200, 
        display: 'flex',
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: '#eef', 
        fontSize: LOKAL_DEFAULT_FONT_SIZE, 
        color: LOKAL_COLORS.ONLINE_FADED,
    },
    mainMenuItem: {
        fontSize: 40,
        margin: 40,
    }
});