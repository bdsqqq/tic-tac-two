const WINNING_COMBINATIONS = [
  // horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // diagonal
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const EMPTY_BOARD: Board = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];

export const GENERATIVE_MOVE_AMOUNT = 3;

export type Sign = "x" | "o";
export type Cell = Sign | undefined;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * undefined is a special position that represents a "generative" move, where the player is adding a new piece to the board.
 */
export type PositionOrGenerative = Position | undefined;

export interface Move {
  from: PositionOrGenerative;
  sign: Sign;
  to: Position;
}

export function assertBoardLength(value: Cell[]): asserts value is Board {
  if (!Array.isArray(value) || value.length !== 9) {
    throw new Error("Invalid board.");
  }
}

export function assertPosition(value: number): asserts value is Position {
  if (value < 0 || value > 8) {
    throw new Error("Invalid position.");
  }
}

export function assertPositionOr(
  value: number | undefined,
): asserts value is PositionOrGenerative {
  if (value !== undefined) assertPosition(value);
}

export function assertExists<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error("Value does not exist.");
  }
}

export function makeGenerativeMove(sign: Move["sign"], to: Move["to"]): Move {
  return { from: undefined, sign, to };
}

export function makeMove(board: Board, move: Move): Board {
  const newBoard = [...board];
  if (move.from !== undefined) newBoard[move.from] = undefined;
  newBoard[move.to] = move.sign;

  assertBoardLength(newBoard);
  return newBoard;
}

export type MoveHistory = Move[];

/**
 * Assumes all moves in History are valid.
 */
export const computeBoardFromHistory = (
  history: MoveHistory,
  index?: number,
): Board => {
  if (index !== undefined && index < 0)
    throw new Error(`Invalid history index. got ${index}`);
  if (index !== undefined && index > history.length)
    throw new Error(
      `Cannot go to future, got ${index} but history length is ${history.length}`,
    );

  let board = [...EMPTY_BOARD];
  for (const move of history) {
    // if index is defined, stop at that index
    if (index !== undefined && move === history[index]) break;

    assertBoardLength(board);
    board = makeMove(board, move);
  }

  assertBoardLength(board);
  return board;
};

export const GENERATIVE_MOVE_CHAR_REPRESENTATION = "-";

export function encodeMove(move: Move): string {
  const { from, sign, to } = move;
  /**
   * represent undefined as a dash, so that the move string is always 3 characters long
   */
  const fromString =
    from === undefined ? GENERATIVE_MOVE_CHAR_REPRESENTATION : from.toString();
  return `${fromString}${sign}${to}`;
}
export const ENCODED_MOVE_LENGTH = 3;

export function decodeMove(moveString: string): Move {
  if (moveString.length !== ENCODED_MOVE_LENGTH)
    throw new Error("Invalid move string.");

  const [fromString, sign, toString] = moveString;

  if (fromString === undefined)
    throw new Error("Invalid move string. from is undefined");
  if (sign === undefined)
    throw new Error("Invalid move string. sign is undefined");
  if (toString === undefined)
    throw new Error("Invalid move string. to is undefined");

  if (
    isNaN(parseInt(fromString)) &&
    fromString !== GENERATIVE_MOVE_CHAR_REPRESENTATION
  )
    throw new Error(`Invalid move string. bad from: ${fromString}`);
  if (sign !== "x" && sign !== "o")
    throw new Error("Invalid move string. bad sign");
  if (isNaN(parseInt(toString))) throw new Error("Invalid move string. bad to");

  const from =
    fromString === GENERATIVE_MOVE_CHAR_REPRESENTATION
      ? undefined
      : parseInt(fromString);
  assertPositionOr(from);

  const to = parseInt(toString);
  assertPosition(to);

  return { from, sign, to };
}

export function encodeHistory(history: MoveHistory): string {
  return history.map(encodeMove).join("");
}

export function decodeHistory(historyString: string): MoveHistory {
  const multipleOfEncodedMoveLenghtExpression = new RegExp(
    `.{${ENCODED_MOVE_LENGTH}}`,
    "g",
  );
  const moves = historyString.match(multipleOfEncodedMoveLenghtExpression);
  if (moves === null)
    throw new Error(
      `Invalid history string. Expected length to be a multiple of ${ENCODED_MOVE_LENGTH}. got ${historyString.length}`,
    );

  return moves.map(decodeMove);
}

export function shouldMoveBeGenerative(board: Board, sign: Sign): boolean {
  return (
    board.filter((piece) => piece === sign).length < GENERATIVE_MOVE_AMOUNT
  );
}

export function isValidMove(board: Board, move: Move): boolean {
  if (move.from !== undefined) {
    if (board[move.from] !== move.sign) return false; // can't move a piece that's not yours
  }
  if (board[move.to] !== undefined) return false; // can't move to a non-empty cell
  return true;
}

export function checkWinner(board: Board): Sign | false {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] === undefined) continue;
    if (board[b] === undefined) continue;
    if (board[c] === undefined) continue;

    if (board[a] === board[b] && board[b] === board[c]) {
      // assignment and assertion because TS can't infer that board[a] is not undefined
      const winner = board[a];
      assertExists(winner);
      return winner;
    }
  }

  return false;
}
