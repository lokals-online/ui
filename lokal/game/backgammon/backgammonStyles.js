import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    backgammon: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'red'
    },
    opponent: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
    },
    turn: {
        color: 'green'
    },
    board: {
        height: '80%',
    },
    boardTop: {
        width: '100%',
        height: '50%',
        display: 'flex',
        flexDirection: 'row',
    },
    boardTopLeft: {
        width: '50%',
        display: 'flex',
        flex: 6,
        flexDirection: 'row-reverse',
        borderRightWidth: 10,
        borderLeftWidth: 10,
    },
    boardTopRight: {
        width: '50%',
        display: 'flex',
        flex: 6,
        flexDirection: 'row-reverse',
        borderLeftWidth: 10
    },
    boardBottom: {
        height: '50%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    },
    boardBottomLeft: {
        width: '50%',
        display: 'flex',
        flex: 6,
        flexDirection: 'row',
        borderRightWidth: 10,
        borderLeftWidth: 10,
    },
    boardBottomRight: {
        width: '50%',
        display: 'flex',
        flex: 6,
        flexDirection: 'row',
        borderLeftWidth: 10,
    },
    slot: {
        alignItems: 'center',
        flex: 1,
        // paddingTop: 20
        //borderColor: "#888"
    },
    slotTop: {
        justifyContent: 'flex-start',
    },
    slotBottom: {
        justifyContent: 'flex-end',
    },
    pieceContainer: {
        width: '70%',
        height: '100%'
    },
    piece: {width: '100%', height: 20, paddingTop: 20, borderRadius: 50},
});

export default styles;