import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import useSudoku from './store/useSudoku';
import { isPeer, squareCellsMap } from './utils';
import Cell from './components/Cell';
import {Supervisor, useGuard} from './components/ConflictGuard';
import Title from './components/Title';
import { getCatFact } from './store/catApi';
import NumberSelector from './components/NumberSelector';
import { CellId } from './types';

function App() {
  const {state: {
    puzzle, 
    solvedPuzzle,
    selectedCell,
    selectedValue,
    loading,
  }, dispatch} = useSudoku();
  const [catUrl, setCatUrl] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [conflicts, setConflicts] = useState<CellId[]>([]);
  // state for time start and end
  // state for time elapsed
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const isComplete = puzzle && Object.values(puzzle).every(({value}) => value);

  useEffect(() => {
    if(isComplete) {
      getCatFact().then((image) => {
        setCatUrl(`https://cataas.com${image.url}`);
      })
    }
  }, [isComplete])
  const onNewPuzzle = () => {
    dispatch({type: "RESET_PUZZLE"});
    setCatUrl("");
    setIsSuccessful(false);
  }
  const newConflicts = [...conflicts]
  let conflicted = conflicts.length > 0;
  const wasSuccessful = () => {
    function arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;
    
      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      a.sort();
      b.sort();
      // you might want to clone your array first.
    
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }
    if(!arraysEqual(newConflicts, conflicts)) {
      console.log("conflicts changed", newConflicts, conflicts)
      // setConflicts(newConflicts);
    }
    if(!isComplete) return false;
    if(conflicted) return false;
    return true;
  }
  if(loading || !puzzle) return <Text>Loading...</Text>
  return (
    <View style={styles.container}>
      <Title onNewPuzzle={onNewPuzzle}/>
      <View style={styles.board}>

        {isComplete ? (
          <View style={{flex: 1, alignItems: "center"}}>
            <Text>Eres lo máximo!</Text>
            {catUrl && <Image source={{uri: catUrl}} style={{width: "100%", height: "100%"}}/>}
          </View>
        ) : Object.entries(squareCellsMap).map(([squareId, cellIds]) => (
          <View key={squareId} style={styles.boardSquare}>
            {cellIds.map(cellId => {
              const isPeerCell = isPeer(cellId, selectedCell);
              const isSelectedCell = cellId === selectedCell;
              const isSameValue = selectedCell && puzzle[cellId].value === puzzle[selectedCell].value;
              const isConflicted = isPeerCell && isSameValue && puzzle[cellId].value && !isSelectedCell;
              if(isConflicted) conflicted = true;
              return (
                <Cell 
                  key={cellId}
                  {...puzzle[cellId]}
                  onClick={() => dispatch({type: "SET_SELECTED_CELL", payload: cellId})}
                  isPeer={isPeer(cellId, selectedCell)}
                  isSelected={cellId === selectedCell}
                  sameValue={selectedCell && puzzle[cellId].value === puzzle[selectedCell].value}
                  isConflicted={isConflicted || conflicts.includes(cellId)}
                />
              )})}
          </View>
        ))}
      </View>
      {conflicted ? <Text>Pensaste, y la cagaste 🤦‍♂️</Text> : null}
      {
        wasSuccessful() ? (
          <View style={{flex: 1, alignItems: "center"}}>
            <Text>Lo lograste!</Text>
            <Text>Feliz Día Papá ❤️</Text>
          </View>
        ) : (
          <NumberSelector
            selectedValue={selectedValue}
            isNote={false}
            selectedNotes={[]}
            onNumberClick={(value) => {
              dispatch({type: "SET_SELECTED_VALUE", payload: value})
              dispatch({type: "SAVE_CELL_VALUE"})
            }}
          />
        )
      }

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  board: {
    display: 'flex',
    marginTop: "10%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: "90%",
    maxWidth: 800,
    height: "auto",
    aspectRatio: 1 / 1,
  },
  boardSquare: {
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexBasis: '33.33%',
    height: "33.33%",
  },
});

export default () => {
  return (
    <Supervisor>
      <App />
    </Supervisor>
  )
}