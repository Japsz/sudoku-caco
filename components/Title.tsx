import { Text, View } from "react-native"
import {useGuard} from "./ConflictGuard"
import { useEffect, useState } from "react";
import { getCatFact } from "../store/catApi";
interface TitleProps {
    onNewPuzzle: () => void;
}
const Title = ({onNewPuzzle}: TitleProps) => {

    const [timeStart, setTimeStart] = useState(new Date());
    return (
        <View style={{marginTop: "15%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "90%"}}>
            <Text style={{fontSize: 10}}>
                by Benja
            </Text>
            <Text style={{flex: 1, fontSize: 40, textAlign: "center"}}>
                Cacoku
            </Text>
            <View onTouchStart={() => {
                onNewPuzzle();
                setTimeStart(new Date());
            }}>
            <Text style={{fontSize: 20}}>
                Nuevo
            </Text>
            </View>
        </View>
    )
}
export default Title;