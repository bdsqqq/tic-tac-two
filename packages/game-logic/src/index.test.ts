import { describe, expect, it } from "vitest";

import { Game } from "./index";

describe("game correctly represents a board", () => {
  it("should have a board", () => {
    const game = new Game();
    expect(game.board).toBeDefined();
  });
});

describe("game does moves", () => {
  it("should make moves", () => {
    const game = new Game();
    game.makeMove({ from: undefined, sign: "x", to: 0 });

    expect(game.board[0]).toBe("x");
  });
  it("should not overlap signs", () => {
    const game = new Game();
    game.makeMove({ from: undefined, sign: "x", to: 0 });
    game.makeMove({ from: undefined, sign: "o", to: 0 });

    expect(game.board[0]).toBe("x");
  });
});

describe("game returns wins correctly", () => {
  it("should return a win", () => {
    const game = new Game();
    game.makeMove({ from: undefined, sign: "x", to: 0 });
    game.makeMove({ from: undefined, sign: "o", to: 3 });
    game.makeMove({ from: undefined, sign: "x", to: 1 });
    game.makeMove({ from: undefined, sign: "o", to: 4 });
    game.makeMove({ from: undefined, sign: "x", to: 2 });

    expect(game.winner).toBe("x");
  });
});
