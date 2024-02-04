import type { Board } from ".";

export const makeTextBoard = (boardProp: Board) => {
  let prettyBoard = "";

  const board = boardProp.map((cell) => cell ?? " ");

  for (let i = 0; i < 9; i += 3) {
    prettyBoard += board.slice(i, i + 3).join(" | ") + "\n";
    if (i < 6) prettyBoard += "— — — — —\n";
  }
  return prettyBoard;
};
