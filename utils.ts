export const rowIds: RowId[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
// Map to know which square a cell belongs to
export const squareIdMap: Record<CellId, SquareId> = 
  Array.from(Array(9).keys())
    .map(() => Array.from(Array(9).keys()))
    .reduce<Record<CellId, SquareId>>((acc, row, i) => {
      row.forEach((_, j) => {
        acc[`${rowIds[i]}${j + 1 as ColumnId}`] = ((Math.floor(i / 3)) * 3) + Math.floor(j / 3) + 1 as SquareId;
      });
      return acc;
    } , {} as Record<CellId, SquareId>);
// Map to know which cells belong to a square
export const squareCellsMap: Record<SquareId, CellId[]> =
  Object.entries(squareIdMap)
    .reduce<Record<SquareId, CellId[]>>((acc, [cellId, squareId]) => {
      if (!acc[squareId]) {
        acc[squareId] = [];
      }
      acc[squareId].push(cellId as CellId);
      return acc;
    }, {} as Record<SquareId, CellId[]>);    
    
function createCellId(rowId: RowId, columnId: ColumnId): CellId {
  return `${rowId}${columnId}` as CellId;
}
function randomChoice(choices: number[]) {
  return choices[Math.floor(Math.random() * choices.length)];
}

export function range(n: number) {
  return Array.from(Array(n).keys());
}
// TODO use immutable when this is all working
export function makePuzzle() {
  while (true) {
    try {
      const puzzle = Array.from(Array(9).keys()).map(() => Array.from(Array(9).keys()));
      const rows = Array.from(Array(9).keys()).map(() => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
      const columns = Array.from(Array(9).keys()).map(() => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
      const squares = Array.from(Array(9).keys()).map(() => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
      const puzzleHash: Partial<Puzzle> = {};
      Array.from(Array(9).keys()).forEach((i) => {
        Array.from(Array(9).keys()).forEach((j) => {
          const row = rows[i];
          const column = columns[j];
          const square = squares[((Math.floor(i / 3)) * 3) + Math.floor(j / 3)];
          const choices = [...row].filter(x => column.has(x)).filter(x => square.has(x));
          const choice = randomChoice(choices);
          if (!choice) {
            // eslint-disable-next-line no-throw-literal
            throw 'dead end';
          }
          puzzle[i][j] = choice;
          const cellId: CellId = `${rowIds[i]}${j + 1 as ColumnId}`;
          puzzleHash[cellId] = { value: choice, notes: [], squareId: squareIdMap[cellId], prefilled: true };
          column.delete(choice);
          row.delete(choice);
          square.delete(choice);
        });
      });
      return puzzleHash as Puzzle;
    } catch (e) {
      // eslint-disable-next-line no-continue
      continue;
    }
  }
}
/**
 * Answers the question: can the cell (i,j) in the puzzle contain the number
 in cell "c"
  * @param puzzle
  * @param i
  * @param j
  * @param c
  */
function canBeA(puzzle: Puzzle, i: RowId, j: ColumnId, sourceCellId: CellId) {
  const cellId: CellId = `${i}${j}`;
  const value = puzzle[sourceCellId].value;
  if (puzzle[cellId].value === value) return true;
  if (puzzle[cellId].value > 0) return false;
  const squarePeers = squareCellsMap[puzzle[cellId].squareId];
  // if not the cell itself, and the mth cell of the group contains the value v, then "no"
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const m in Array.from(Array(9).keys())) {
    const iterator = parseInt(m, 10); 
    const rowPeerId = createCellId(rowIds[iterator], j)
    const columnPeerId = createCellId(i, iterator + 1 as ColumnId);
    const SquarePeerId = squarePeers[iterator];
    if (!(rowPeerId !== sourceCellId) && puzzle[rowPeerId].value === value) return false;
    if (!(columnPeerId !== sourceCellId) && puzzle[columnPeerId].value === value) return false;
    if (!(SquarePeerId !== sourceCellId) && puzzle[SquarePeerId].value === value) return false;
  }
  return true;
}

/**
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
export function isPeer(a: CellId, b: CellId) {
  if (!a || !b) return false;
  const squareA = squareIdMap[a];
  const squareB = squareIdMap[b];
  return a.charAt(0) === b.charAt(0) || a.charAt(1) === b.charAt(1) || squareA === squareB;
}

export function pluck(allCells: Puzzle, n = 0) {
  const puzzle: Puzzle = JSON.parse(JSON.stringify(allCells));
  /**
     * starts with a set of all 81 cells, and tries to remove one (randomly) at a time,
     * but not before checking that the cell can still be deduced from the remaining cells.
     * @type {Set}
     */
  const cells = new Set(Array.from(Array(81).keys()));
  const cellsLeft = new Set(cells);
  while (cellsLeft.size && cells.size > n) {
    const cell = randomChoice([...cells]);
    const x = Math.floor(cell / 9);
    const y = cell % 9;
    const cellId = createCellId(rowIds[x], y + 1 as ColumnId);
    cellsLeft.delete(cell);
    /**
         * row, column and square record whether another cell in those groups could also take
         * on the value we are trying to pluck. (If another cell can, then we can't use the
         * group to deduce this value.) If all three groups are True, then we cannot pluck
         * this cell and must try another one.
         */
    let row = false;
    let column = false;
    let square = false;
    range(9).forEach((i) => {
      const rowPeer = { x: i, y: y + 1 };
      const columnPeer = { x, y: i + 1 };
      const squarePeer = {
        x: (Math.floor(Math.floor(cell / 9) / 3) * 3) + Math.floor(i / 3),
        y: ((Math.floor(cell / 9) % 3) * 3) + (i % 3) + 1,
      };
      if (rowPeer.x !== x) {
        row = canBeA(puzzle, rowIds[rowPeer.x], rowPeer.y as ColumnId, cellId);
      }
      if (columnPeer.y !== y) {
        column = canBeA(puzzle, rowIds[columnPeer.x], columnPeer.y as ColumnId, cellId);
      }
      if (squarePeer.x !== x && squarePeer.y !== y) {
        square = canBeA(puzzle, rowIds[squarePeer.x], squarePeer.y as ColumnId, cellId);
      }
    });
    if (row && column && square) {
      // eslint-disable-next-line no-continue
      continue;
    } else {
      // this is a pluckable cell!
      // eslint-disable-next-line no-param-reassign
      puzzle[cellId].value = 0; // 0 denotes a blank cell
      puzzle[cellId].prefilled = false;
      /**
             * remove from the set of visible cells (pluck it)
             * we don't need to reset "cellsleft" because if a cell was not pluckable
             * earlier, then it will still not be pluckable now (with less information
             * on the board).
             */
      cells.delete(cell);
    }
  }
  return { puzzle, size: cells.size };
}