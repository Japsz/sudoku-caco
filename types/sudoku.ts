type RowId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
type ColumnId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SquareId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Cell  = {
    value: number;
    notes: number[];
    squareId: SquareId;
    prefilled?: boolean;
}

type ConcatedId<T extends RowId, U extends ColumnId> = `${T}${U}`
export type CellId = ConcatedId<RowId, ColumnId>
export type Puzzle = Record<CellId, Cell>