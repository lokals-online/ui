import { Pressable, View } from "react-native"
import { LokalText } from "../../common/LokalCommons"
import { lokalFormStyle } from "../backgammon/BackgammonForm"
import { useBatakSession } from "./BatakSessionProvider";

export const BatakFormComponent = () => {

    const {settings, updateSessionSettings} = useBatakSession();

    return <View style={{height: '100%', width: '100%', justifyContent: 'space-around', padding: 20}}>
    <View style={{width: '100%', height: '50%', justifyContent: 'space-evenly'}}>
        <View style={{width: '100%'}}><LokalText>Kaçta biter?</LokalText></View>
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
            {[11,31,51,71].map((raceTo, index) =>
                <Pressable 
                    key={`${index}-raceTo`} 
                    // style={{borderWidth: 1, borderColor: 'red'}}
                    onPress={() => updateSessionSettings({raceTo: raceTo})}>
                        <LokalText style={(settings?.raceTo == raceTo) ? 
                            lokalFormStyle.raceToItemSelected : lokalFormStyle.raceToItem
                        }>{raceTo}</LokalText>
                    </Pressable>
                )
            }
        </View>
    </View>
</View>

}