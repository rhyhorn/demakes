export { BOARD_SIZE, DOOR_INFO } from './config';
export { describeMovesLeft } from './lib/door';
export { getBoardCellRect, registerBoardCell } from './lib/boardCells';
export {
  CELL_COUNT,
  FINAL_LEVEL,
  FIRST_LEVEL,
  isExitOpen,
  pickRowCell,
  REQUIRED_MOVES,
  useBoardStore,
} from './model/boardStore';
export {
  type CellWeight,
  EQUAL_WEIGHT,
  getAvailableCells,
  getCellChance,
  getRowCells,
  getWeightedCells,
} from './model/rows';
