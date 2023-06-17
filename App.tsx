import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useSudoku from './store/useSudoku';
import { isPeer, squareCellsMap } from './utils';
import Cell from './components/Cell';
import {Supervisor, useGuard} from './components/ConflictGuard';
import Title from './components/Title';

function App() {
  const {state: {
    puzzle, 
    solvedPuzzle,
    selectedCell,
    loading,
  }, dispatch} = useSudoku();
  if(loading || !puzzle) return <Text>Loading...</Text>
  return (
    <View style={styles.container}>
      <Title onNewPuzzle={() => dispatch({type: "RESET_PUZZLE"})}/>
      <View style={styles.board}>
        {Object.entries(squareCellsMap).map(([squareId, cellIds]) => (
          <View key={squareId} style={styles.boardSquare}>
            {cellIds.map(cellId => (
              <Cell 
                key={cellId}
                {...puzzle[cellId]}
                onClick={() => dispatch({type: "SET_SELECTED_CELL", payload: cellId})}
                isPeer={isPeer(cellId, selectedCell)}
                isSelected={cellId === selectedCell}
                sameValue={selectedCell && puzzle[cellId].value === puzzle[selectedCell].value}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={{marginTop: "10%",display: 'flex', flexDirection: 'row', width: "90%", height: "10%", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        {new Array(10).fill(0).map((_, i) => (
          <View key={i} style={{display: "flex", height: "50%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 50, flexBasis: "12%"}} onTouchStart={() => {dispatch({type: "SET_SELECTED_VALUE", payload: i !== 9 ? i + 1 : 0});dispatch({type: "SAVE_CELL_VALUE"})}}>
            {i < 9 ? <Text>{i + 1}</Text> : <Text>Clear</Text>}
          </View>
        ))}
      </View>
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