import { expect, test } from "vitest";

import { EMPTY_BOARD, makeMove } from "./";

test("makeMove", () => {
  const board = makeMove(EMPTY_BOARD, { from: undefined, sign: "x", to: 0 });

  expect(board).toEqual(["x", ...EMPTY_BOARD.slice(1)]);
});
