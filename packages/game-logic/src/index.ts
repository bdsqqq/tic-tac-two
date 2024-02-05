import { produce } from "immer";

import type { Board, Move, MoveHistory, Sign } from "./core";
import { checkWinner, computeBoardFromHistory, EMPTY_BOARD } from "./core";

export class Game {
  history: MoveHistory;
  historyIndex: number;
  upToDate: boolean;
  turn: Sign;
  nextTurn: Sign;
  board: Board;
  gameLocked: boolean;
  winner: Sign | false;
  score: Record<Sign, number>;
  constructor({
    history = [],
    historyIndex: propHistoryIndex,
  }: { history?: MoveHistory; historyIndex?: number } = {}) {
    const historyIndex = propHistoryIndex ?? history.length;

    this.history = history;
    this.historyIndex = historyIndex;
    this.upToDate = historyIndex === history.length;
    this.turn = historyIndex % 2 === 0 ? "x" : "o";
    this.nextTurn = this.turn === "x" ? "o" : "x";

    this.board = computeBoardFromHistory(history, historyIndex);
    this.gameLocked = !!checkWinner(this.board);
    this.winner = checkWinner(this.board);

    this.score = { x: 0, o: 0 };
  }

  /**
   * Returns some of the game's state.
   * Useful for exposing game state after
   * some action has been triggered by
   * a consumer.
   */
  exposeState() {
    return {
      board: this.board,
      winner: this.winner,
      score: this.score,
    };
  }

  private attemmptAction<T>(action: () => T) {
    if (this.gameLocked) throw new Error("Game is locked");
    const res = action();

    return res;
  }

  makeMove(move: Move) {
    return this.attemmptAction(() => {
      this.history = this.history.slice(0, this.historyIndex);
      this.history.push(move);
      this.historyIndex = this.history.length;

      this.board = computeBoardFromHistory(this.history, this.historyIndex);
      this.winner = checkWinner(this.board);
      this.gameLocked = !!this.winner;

      if (this.winner) {
        this.score[this.winner]++;
      }

      this.turn = this.nextTurn;
      this.nextTurn = this.turn === "x" ? "o" : "x";
      return this.exposeState();
    });
  }

  resetGame() {
    this.history = [];
    this.historyIndex = 0;
    this.upToDate = true;
    this.turn = "x";
    this.nextTurn = "o";
    this.board = EMPTY_BOARD;
    this.gameLocked = false;
    this.winner = false;
    this.score = { x: 0, o: 0 };
  }

  undo() {
    if (this.historyIndex === 0) return;

    this.historyIndex--;
    this.board = computeBoardFromHistory(this.history, this.historyIndex);
    this.winner = checkWinner(this.board);
    this.gameLocked = !!this.winner;

    return this.exposeState();
  }

  redo() {
    if (this.historyIndex === this.history.length) return;

    this.historyIndex++;
    this.board = computeBoardFromHistory(this.history, this.historyIndex);
    this.winner = checkWinner(this.board);
    this.gameLocked = !!this.winner;

    return this.exposeState();
  }

  getHistory() {
    return this.history;
  }

  getHistoryIndex() {
    return this.historyIndex;
  }

  getUpToDate() {
    return this.upToDate;
  }
}

const game = new Game({
  history: [
    { from: undefined, sign: "x", to: 0 },
    { from: undefined, sign: "o", to: 1 },
    { from: undefined, sign: "x", to: 2 },
    { from: undefined, sign: "o", to: 3 },
  ],
});
