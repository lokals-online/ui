import { Pressable, View } from "react-native"
import { LokalText } from "../../common/LokalCommons"
import { usePishtiSession } from "./PishtiSessionProvider";
import { lokalFormStyle } from "../backgammon/BackgammonForm";
import { CHIRAK_PLAYER } from "../../player/Player";

export const PishtiFormComponent = () => {

    const {session, updateSessionSettings, newSession, reloadSession, opponent, setOpponent} = usePishtiSession();

    return <View style={{height: '100%', width: '100%', justifyContent: 'space-around', padding: 20}}>
        <View style={{width: '100%', height: '50%', justifyContent: 'space-evenly'}}>
            <View style={{width: '100%'}}><LokalText>Kaçta biter?</LokalText></View>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                {Array.from({ length: 3}, (_, index) =>
                    <Pressable 
                        key={`${index}-raceTo`} 
                        // style={{borderWidth: 1, borderColor: 'red'}}
                        onPress={() => updateSessionSettings({raceTo: index+1})}>
                            <LokalText style={(session?.settings?.raceTo == (index+1)) ? 
                                lokalFormStyle.raceToItemSelected : lokalFormStyle.raceToItem
                            }>{index+1}</LokalText>
                        </Pressable>
                    )
                }
            </View>
        </View>
        <View style={{width: '100%', height: '50%', justifyContent: 'space-evenly'}}>
            <View style={{width: '100%'}}><LokalText>rakip: </LokalText></View>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                {[CHIRAK_PLAYER, {id: "QR", username: "QR"}].map((opp: any) => 
                    <Pressable 
                        key={`opponent-${opp.id}`} 
                        onPress={() => setOpponent(opp.id)}>
                        <LokalText style={(opponent === opp.id) ? 
                                lokalFormStyle.opponentItemSelected : lokalFormStyle.opponentItem
                            }>{opp.username}</LokalText>
                    </Pressable>
                )}
                {/* <Pressable 
                    key={`opponent-lokal`} 
                    disabled={true}
                    onPress={() => console.log("lokal is not available")}>
                    <LokalText style={backgammonFormStyle.opponentItem}>
                        <Animated.View style={onlinePlayerCheckIconStyle}>
                            {'@'}
                        </Animated.View>
                        lokal</LokalText>
                </Pressable> */}
            </View>
        </View>
    </View>

}