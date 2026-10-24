export { BOARD_SIZE } from './config';
export {
  CELL_COUNT,
  FINAL_LEVEL,
  FIRST_LEVEL,
  isExitOpen,
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
