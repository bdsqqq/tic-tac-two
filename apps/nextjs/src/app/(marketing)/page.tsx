'use client';
import { cn } from '@haxiom/ui';
import { Button } from '@haxiom/ui/button';
import { useState } from 'react';

export const runtime = 'edge';

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

const GENERATIVE_MOVE_AMOUNT = 3;

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

function assertPositionOr(value: number | undefined): asserts value is PositionOrGenerative {
  if (value !== undefined) assertPosition(value);
}

function assertExists<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error('Value does not exist.');
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

const GENERATIVE_MOVE_CHAR_REPRESENTATION = '-';

function encodeMove(move: Move): string {
  const { from, sign, to } = move;
  /**
   * represent undefined as a dash, so that the move string is always 3 characters long
   */
  const fromString = from === undefined ? GENERATIVE_MOVE_CHAR_REPRESENTATION : from.toString();
  return `${fromString}${sign}${to}`;
}

function decodeMove(moveString: string): Move {
  // assert moveString is 3 characters long
  if (moveString.length !== 3) throw new Error('Invalid move string.');

  const [fromString, sign, toString] = moveString;

  if (fromString === undefined) throw new Error('Invalid move string. from is undefined');
  if (sign === undefined) throw new Error('Invalid move string. sign is undefined');
  if (toString === undefined) throw new Error('Invalid move string. to is undefined');

  if (isNaN(parseInt(fromString))) throw new Error('Invalid move string. bad from');
  if (sign !== 'x' && sign !== 'o') throw new Error('Invalid move string. bad sign');
  if (isNaN(parseInt(toString))) throw new Error('Invalid move string. bad to');

  const from = fromString === GENERATIVE_MOVE_CHAR_REPRESENTATION ? undefined : parseInt(fromString);
  assertPositionOr(from);

  const to = parseInt(toString);
  assertPosition(to);

  return { from, sign, to };
}

function shouldMoveBeGenerative(board: Board, sign: Sign): boolean {
  return board.filter((piece) => piece === sign).length < GENERATIVE_MOVE_AMOUNT;
}

function isValidMove(board: Board, move: Move): boolean {
  if (move.from !== undefined) {
    if (board[move.from] !== move.sign) return false; // can't move a piece that's not yours
  }
  if (board[move.to] !== undefined) return false; // can't move to a non-empty cell
  return true;
}

function checkWinner(board: Board): Sign | false {
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

export default function Home() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [turn, setTurn] = useState<'x' | 'o'>('x');
  const nextTurn = turn === 'x' ? 'o' : 'x';
  const passTurn = () => setTurn(nextTurn);

  const [pieceToMove, setPieceToMove] = useState<Position | undefined>(undefined);
  const clearPieceToMove = () => setPieceToMove(undefined);

  const moveRoutine = (move: Move) => {
    console.log('move', encodeMove(move));
    const newBoard = makeMove(board, move);
    setBoard(newBoard);
    const winner = checkWinner(newBoard);
    clearPieceToMove();
    if (winner) {
      console.log('🎉🎉 ', winner, ' wins 🎉🎉');
      return;
    }
    passTurn();
  };

  const newGame = () => {
    setBoard(EMPTY_BOARD);
    setTurn('x');
    clearPieceToMove();
  };

  return (
    <main className="flex justify-between gap-8">
      <div className="shrink-0 w-fit grid grid-cols-3 grid-rows-3 gap-4">
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
                moveRoutine(move);
                return;
              }

              // select piece to move
              if (pieceToMove === undefined) {
                // can't select empty cell
                if (cell === undefined) return;
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
              moveRoutine(move);
            }}
            key={index}
            className={cn('bg-gray-3 w-40 h-40', pieceToMove === index && 'bg-gray-5')}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-between shrink">
        <div>current turn: {turn}</div>
        <div>
          <p className="w-full">{DESCRIPTION}</p>
          <Button className="mr-0 ml-auto block" onClick={newGame}>
            New game
          </Button>
        </div>
      </div>
    </main>
  );
}

const DESCRIPTION = `
tic-tac-two aims to solve draws.

players put 3 of their respective pieces (x, o) in the field normally.
Once 3 pieces are in the field, you can't put new ones, but instead move the ones in the field.`;

/*
tic-tac-two aims to solve draws.

players put 3 of their respective pieces (x, o) in the field normally. 
Once 3 pieces are in the field, you can't put new ones, but instead move the ones in the field.
The winner is whoever gets 3 in a row vertically, horizontally or diagonally.
*/

// The "Board" will always be represented as an array of x, o or undefined, where undefined is empty.

// I prefer using an abstraction to update the Board, where a function takes a new move and returns the new Board. This is a pure function, and it's easy to test.
//   For the abstraction, I want to use a move notation of 3 characters, the first being the previous position of the piece, the second being the sign of the piece, and the third being the new position of the piece. eg: "1X8". Notice that since the board is represented as an array, 8 is the last one and 9 would be an invalid move. 9 could represent a "generative" move, where the player is adding a new piece to the board.

/*
TODO:
- move history as a source of truth (push moves to history, use history to calculate the board)[think about optimizations later]
- - this will allow time travel + programatically doing moves (eg: a button that makes a specific move (will help with testing not controlling both players), or gesture controls (dnd-kit maybe?))

- write tests
- - this project actually makes me wanna write them. wtf.

- make the UI pretty
- - themes?

- tutorial

- game timer
- points system
- per player timer (akin to chess)

- multiplayer (partykit??)
- - rooms?
- - - spectators?

- share match (eg: encode history into query params, reconstruct game from it)
 */
