'use client';
import { useState } from 'react';

export const runtime = 'edge';

const EMPTY_BOARD: Board = [
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

const GENERATIVE_MOVE_AMMOUNT = 3;

type Sign = 'x' | 'o';
type Cell = Sign | undefined;
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * undefined is a special position that represents a "generative" move, where the player is adding a new piece to the board.
 */
type PositionOrGenerative = Position | undefined;

interface Move {
  from: PositionOrGenerative;
  sign: Sign;
  to: Position;
}

function assertBoardLength(value: Cell[]): asserts value is Board {
  if (!Array.isArray(value) || value.length !== 9) {
    throw new Error('Invalid board.');
  }
}

function assertPosition(value: number): asserts value is Position {
  if (value < 0 || value > 8) {
    throw new Error('Invalid position.');
  }
}

function makeMove(board: Board, move: Move): Board {
  const newBoard = [...board];
  if (move.from !== undefined) newBoard[move.from] = undefined;
  newBoard[move.to] = move.sign;

  assertBoardLength(newBoard);
  return newBoard;
}

function makeGenerativeMove(sign: Move['sign'], to: Move['to']): Move {
  return { from: undefined, sign, to };
}

function shouldMoveBeGenerative(board: Board, sign: Sign): boolean {
  return board.filter((piece) => piece === sign).length < GENERATIVE_MOVE_AMMOUNT;
}

function isValidMove(board: Board, move: Move): boolean {
  if (move.from !== undefined) {
    if (board[move.from] !== move.sign) return false; // can't move a piece that's not yours
  }
  if (board[move.to] !== undefined) return false; // can't move to a non-empty cell
  return true;
}

function isWinningBoard(board: Board): boolean {
  // TODO
  return false;
}

export default function Home() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [turn, setTurn] = useState<'x' | 'o'>('x');

  const nextTurn = turn === 'x' ? 'o' : 'x';

  const [pieceToMove, setPieceToMove] = useState<Position | undefined>(undefined);
  const clearPieceToMove = () => setPieceToMove(undefined);

  return (
    <main className="flex justify-evenly">
      <div className="w-fit grid grid-cols-3 grid-rows-3 gap-4">
        {board.map((cell, index) => (
          <button
            onClick={(e) => {
              e.preventDefault();

              assertPosition(index);

              // check if piece is yours, no action allowed if it's not
              if (cell !== undefined && cell !== turn) return;

              // check if move should be generative
              if (shouldMoveBeGenerative(board, turn)) {
                const move = makeGenerativeMove(turn, index);
                const newBoard = makeMove(board, move);
                setBoard(newBoard);
                setTurn(nextTurn);
                return;
              }

              // select piece to move
              if (pieceToMove === undefined) {
                setPieceToMove(index);
                return;
              }

              // if clicked on the same piece, deselect it
              if (pieceToMove === index) {
                clearPieceToMove();
                return;
              }

              // move piece
              const move = { from: pieceToMove, sign: turn, to: index };
              if (!isValidMove(board, move)) return;
              const newBoard = makeMove(board, move);
              setBoard(newBoard);
            }}
            key={index}
            className="bg-gray-3 w-40 h-40"
          >
            {cell}
          </button>
        ))}
      </div>

      <div>
        <div>current turn: {turn}</div>
        <pre>
          <code>{JSON.stringify(board, null, 2)}</code>
        </pre>
      </div>
    </main>
  );
}

/*
tic-tac-two aims to solve draws.

players put 3 of their respective pieces (x, o) in the field normally. 
Once 3 pieces are in the field, you can't put new ones, but instead move the ones in the field.
The winner is whoever gets 3 in a row vertically, horizontally or diagonally.
*/

// The "Board" will always be represented as an array of x, o or undefined, where undefined is empty.

// I prefer using an abstraction to update the Board, where a function takes a new move and returns the new Board. This is a pure function, and it's easy to test.
//   For the abstraction, I want to use a move notation of 3 characters, the first being the previous position of the piece, the second being the sign of the piece, and the third being the new position of the piece. eg: "1X8". Notice that since the board is represented as an array, 8 is the last one and 9 would be an invalid move. 9 could represent a "generative" move, where the player is adding a new piece to the board.

//
