import { Text, View, StyleSheet } from "react-native";

interface NumberSelectorProps {
    selectedValue?: number,
    selectedNotes: number[],
    isNote: boolean,
    onNumberClick: (value?: number) => void,
}
const NumberSelector = (props: NumberSelectorProps) => {
    const { selectedValue, selectedNotes, isNote, onNumberClick } = props;
    const shouldBeSelected = (value?: number) => {
        if(isNote && value) {
            return selectedNotes.includes(value);
        } else {
            return value === selectedValue;
        }
    }

    return (
      <View style={styles.numberBar}>
        {new Array(10).fill(0).map((_, i) => (
          <View key={i} style={{...styles.numberCell, ...(shouldBeSelected(i < 9 ? i + 1 : 0)) && styles.numberCellSelected}} onTouchStart={() => onNumberClick(i < 9 ? i + 1 : 0)}>
            {i < 9 ? <Text>{i + 1}</Text> : <Text>Clear</Text>}
          </View>
        ))}
      </View>
    );
}
const styles = StyleSheet.create({
    numberBar: {marginTop: "10%",display: 'flex', flexDirection: 'row', width: "90%", height: "10%", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 10 },
    numberCell: {display: "flex", height: "50%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 50, flexBasis: "12%"},
    numberCellSelected: {backgroundColor: "rgba(0,0,255,.05)", borderWidth: 2, borderColor: "rgba(0,0,255,.5)", height: "60%"}
});
export default NumberSelector;