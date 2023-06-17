import {Cell as CellType} from '../types';
import {View, Text, StyleSheet} from 'react-native';
import {Connector} from './ConflictGuard';
interface CellProps extends CellType {
  // cell click handler
  onClick: () => void,
  // if the cell is a peer of the selected cell
  isPeer: boolean,
  // if the cell is selected by the user
  isSelected: boolean,
  // current cell has the same value if the user selected cell
  sameValue: boolean,
};
const Cell = (props: CellProps) => {
  const {
    value, onClick, isPeer, isSelected, sameValue, prefilled, notes,
  } = props;
  let style = styles.boardCell;
  if(isPeer) {
    style = {
      ...style,
      ...styles.boardCellPeer
    }
  }
  if(sameValue && value && !isSelected) {
    style = {
      ...style,
      ...styles.boardCellSameValue
    }
  }
  if (isSelected) {
    style = {
      ...style,
      ...styles.boardCellSelected
    }
  }
  let conflicted = false;
  if(isPeer && sameValue && !isSelected && value) {
    conflicted = true;
    style = {
      ...style,
      ...styles.boardCellConflicted
    }
  }
  const onCellClick = () => {
    if(prefilled) return;
    if(!isSelected) return onClick();
  }
  return (
    <View style={style} onTouchStart={onCellClick}>
      <Connector isDirty={conflicted} />
      <Text adjustsFontSizeToFit>{value || ""}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  boardCell: {
    display: 'flex',
    height: "33.33%",
    flexBasis: '33.33%',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardCellPeer: {
    backgroundColor: "rgba(0, 20, 255, 0.1)",
  },
  boardCellSelected: {
    borderColor: "rgba(28, 73, 180, 0.5)",
    borderWidth: 2,
  },
  boardCellConflicted: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
  boardCellSameValue: {
    backgroundColor: "rgba(255, 206, 0, 0.2)",
  }
});
export default Cell;