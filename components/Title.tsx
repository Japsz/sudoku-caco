import { Text, View } from "react-native"
import {useGuard} from "./ConflictGuard"
import { useEffect, useState } from "react";
interface TitleProps {
    onNewPuzzle: () => void;
}
const Title = ({onNewPuzzle}: TitleProps) => {
    const checkConflicts = useGuard();
    const [isConflicted, setConflicts] = useState(false);
    const [timeStart, setTimeStart] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            const hasConflicts = checkConflicts();
            // console.log("timerCheck", hasConflicts)
            if(hasConflicts && !isConflicted) {
                console.log("setConflicts")
                setConflicts(true);
            }
            if(!hasConflicts && isConflicted) {
                console.log("clearConflicts")
                setConflicts(false);
            }
        }, 500);
        return () => {
            clearInterval(timer);
        }
    }, [])
    return (
        <View style={{marginTop: "15%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "90%"}}>
            <Text style={{fontSize: 10}}>
                jeje
            </Text>
            <Text style={{flex: 1, fontSize: 40, textAlign: "center"}}>
                Cacoku{isConflicted ? " (conflicted)" : ""}
            </Text>
            <View onTouchStart={() => {
                onNewPuzzle();
                setTimeStart(new Date());
            }}>
            <Text style={{fontSize: 20}}>
                new
            </Text>
            </View>
        </View>
    )
}
export default Title;