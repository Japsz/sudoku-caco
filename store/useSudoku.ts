import { useEffect, useReducer } from "react"
import { makePuzzle, pluck } from "../utils"
import { CellId, Puzzle } from "../types"

interface SudokuAction {
    type: string
    payload?: any
}

interface SudokuState {
    puzzle?: Puzzle
    solvedPuzzle?: Puzzle
    selectedCell?: CellId
    selectedValue?: number
    selectedNotes?: number[]
    notesMode: boolean
    error?: string
    loading: boolean
    difficulty: number
}
type SudokuReducer = (state: SudokuState, action: SudokuAction) => SudokuState
interface UseSudokuReturn {
    dispatch: React.Dispatch<SudokuAction>
    state: SudokuState
}
const initialState: SudokuState = {
    notesMode: false,
    loading: true,
    difficulty: 3,
}    
const useSudoku = () => {
    const [state, dispatch] = useReducer<SudokuReducer>((state, action: SudokuAction) => {
        switch (action.type) {
            case "RESET_PUZZLE":
                const solution = makePuzzle()
                const { puzzle } = pluck(solution, 81 - state.difficulty)
                return {
                    ...state,
                    puzzle,
                    solvedPuzzle: solution,
                    loading: false
                }
            case "SET_DIFFICULTY":
                return {
                    ...state,
                    difficulty: action.payload
                }
            case "SET_SELECTED_CELL":
                return {
                    ...state,
                    selectedCell: action.payload
                }
            case "SET_SELECTED_VALUE":
                return {
                    ...state,
                    selectedValue: action.payload
                }
            case "SET_SELECTED_NOTES":
                return {
                    ...state,
                    selectedNotes: action.payload
                }
            case "TOGGLE_NOTES_MODE":
                return {
                    ...state,
                    notesMode: !state.notesMode
                }
            case "SAVE_CELL_VALUE":
                if(!state.selectedCell || state.selectedValue === undefined) return state
                const newPuzzle = JSON.parse(JSON.stringify(state.puzzle))
                newPuzzle[state.selectedCell] = {
                    ...newPuzzle[state.selectedCell],
                    value: state.selectedValue
                }
                return {
                    ...state,
                    puzzle: newPuzzle
                }
            default:
                return state
        }
    }, initialState)
    useEffect(() => {
        dispatch({ type: "RESET_PUZZLE" })
    }, [])
    return {
        dispatch,
        state
    }
}
export default useSudoku