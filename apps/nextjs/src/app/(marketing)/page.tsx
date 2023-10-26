'use client';
import { cn } from '@haxiom/ui';
import type { ButtonProps as UiButtonProps } from '@haxiom/ui/button';
import { Button } from '@haxiom/ui/button';
import { Input } from '@haxiom/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';
import { Table, TableBody, TableRow, TableFooter } from '@haxiom/ui/table';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, forwardRef, useContext, useEffect, useState } from 'react';

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

function makeGenerativeMove(sign: Move['sign'], to: Move['to']): Move {
  return { from: undefined, sign, to };
}

function makeMove(board: Board, move: Move): Board {
  const newBoard = [...board];
  if (move.from !== undefined) newBoard[move.from] = undefined;
  newBoard[move.to] = move.sign;

  assertBoardLength(newBoard);
  return newBoard;
}

type MoveHistory = Move[];

/**
 * Assumes all moves in History are valid.
 */
const computeBoardFromHistory = (history: MoveHistory, index?: number): Board => {
  if (index !== undefined && index < 0) throw new Error(`Invalid history index. got ${index}`);
  if (index !== undefined && index > history.length)
    throw new Error(`Cannot go to future, got ${index} but history length is ${history.length}`);

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

const GENERATIVE_MOVE_CHAR_REPRESENTATION = '-';

function encodeMove(move: Move): string {
  const { from, sign, to } = move;
  /**
   * represent undefined as a dash, so that the move string is always 3 characters long
   */
  const fromString = from === undefined ? GENERATIVE_MOVE_CHAR_REPRESENTATION : from.toString();
  return `${fromString}${sign}${to}`;
}
const ENCODED_MOVE_LENGTH = 3;

function decodeMove(moveString: string): Move {
  if (moveString.length !== ENCODED_MOVE_LENGTH) throw new Error('Invalid move string.');

  const [fromString, sign, toString] = moveString;

  if (fromString === undefined) throw new Error('Invalid move string. from is undefined');
  if (sign === undefined) throw new Error('Invalid move string. sign is undefined');
  if (toString === undefined) throw new Error('Invalid move string. to is undefined');

  if (isNaN(parseInt(fromString)) && fromString !== GENERATIVE_MOVE_CHAR_REPRESENTATION)
    throw new Error(`Invalid move string. bad from: ${fromString}`);
  if (sign !== 'x' && sign !== 'o') throw new Error('Invalid move string. bad sign');
  if (isNaN(parseInt(toString))) throw new Error('Invalid move string. bad to');

  const from = fromString === GENERATIVE_MOVE_CHAR_REPRESENTATION ? undefined : parseInt(fromString);
  assertPositionOr(from);

  const to = parseInt(toString);
  assertPosition(to);

  return { from, sign, to };
}

function encodeHistory(history: MoveHistory): string {
  return history.map(encodeMove).join('');
}

function decodeHistory(historyString: string): MoveHistory {
  const multipleOfEncodedMoveLenghtExpression = new RegExp(`.{${ENCODED_MOVE_LENGTH}}`, 'g');
  const moves = historyString.match(multipleOfEncodedMoveLenghtExpression);
  if (moves === null)
    throw new Error(
      `Invalid history string. Expected length to be a multiple of ${ENCODED_MOVE_LENGTH}. got ${historyString.length}`
    );

  return moves.map(decodeMove);
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
  return (
    <main className="flex flex-col md:flex-row md:justify-between gap-8">
      <Game>
        <LoadGameFromURL />
        <div className="shrink-0">
          <Board />
        </div>

        <div className="flex flex-col justify-between shrink">
          <CurrentTurn />
          <History />
          <HistoryControls />

          <div>
            <p className="w-full">{DESCRIPTION}</p>
            <NewGameButton className="mr-0 ml-auto block">New game</NewGameButton>
          </div>
        </div>
      </Game>
    </main>
  );
}

const Cell = ({
  children,
  highlight,
  ...rest
}: React.HTMLProps<HTMLDivElement> & {
  children: React.ReactNode;
  highlight: boolean;
}) => {
  return (
    <div {...rest} className={cn('bg-gray-3 p-2 rounded w-40 h-40', highlight && 'bg-gray-9')}>
      {children}
    </div>
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Empty = forwardRef<HTMLButtonElement, ButtonProps>(({ ...rest }, ref) => {
  return (
    <button {...rest} className="flex justify-center items-center bg-transparent rounded-md h-full w-full" ref={ref} />
  );
});
Empty.displayName = 'Empty';

const Piece = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  return (
    <button {...rest} className="flex justify-center items-center bg-subtle rounded-md h-full w-full" ref={ref}>
      <div className="font-bold text-7xl">{children}</div>
    </button>
  );
});
Piece.displayName = 'Piece';

const Board = () => {
  const { board, turn, pieceToMove, setPieceToMove, clearPieceToMove, upToDate, attemptAction, moveRoutine } =
    useGameContext();

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2">
      {board.map((cell, index) => (
        <Cell key={index} highlight={upToDate && pieceToMove === index}>
          {cell !== undefined ? (
            <Piece
              onClick={() => {
                assertPosition(index);

                // check if piece is yours, no action allowed if it's not
                if (cell !== undefined && cell !== turn) return;

                // only allow selecting if out of generative moves
                if (shouldMoveBeGenerative(board, turn)) return;

                // if clicked on the same piece, deselect it
                if (pieceToMove === index) {
                  attemptAction(() => {
                    clearPieceToMove();
                  });
                  return;
                }

                // can't select empty cell
                if (cell === undefined) return;
                attemptAction(() => {
                  setPieceToMove(index);
                });
                return;
              }}
            >
              {cell}
            </Piece>
          ) : (
            <Empty
              onClick={() => {
                assertPosition(index);

                // check if move should be generative
                if (shouldMoveBeGenerative(board, turn)) {
                  const move = makeGenerativeMove(turn, index);
                  attemptAction(() => {
                    moveRoutine(move);
                  });
                  return;
                }

                // move piece
                if (pieceToMove !== undefined) {
                  // explicitly compare against undefined. piece could be 0 which is falsy.
                  const move = { from: pieceToMove, sign: turn, to: index };
                  if (!isValidMove(board, move)) return;
                  attemptAction(() => {
                    moveRoutine(move);
                  });
                }
              }}
            />
          )}
        </Cell>
      ))}
    </div>
  );
};

const Game = ({ children }: { children: ReactNode }) => {
  return <GameContextProvider>{children}</GameContextProvider>;
};

const History = () => {
  const { history } = useGameContext();

  return (
    <Table className="w-fit h-full">
      <TableBody className="border whitespace-nowrap font-mono">
        {history.length === 0 ? (
          <TableRow
            className="grid grid-cols-3 even:bg-element hover:bg-gray-1 even:hover:bg-element gap-4 p-2"
            key={'placeholder'}
          >
            {/* TODO: chess.com has slots on the sides of moves to signify blunders, good moves, etc. I'm most interested in "this was the winning move", but maybe it's cool to make analysis since tic tac toe is a finite game and analysis would only need low depths. */}
            <td className="text-end">1.</td>
            <td className="text-transparent">...</td>
            <td className="text-transparent">...</td>
          </TableRow>
        ) : null}

        {history.map((move, index) => {
          if (index % 2 === 0) {
            const player1Move = move;
            const player2Move = history[index + 1];

            return (
              <TableRow
                className="grid grid-cols-3 even:bg-element hover:bg-gray-1 even:hover:bg-element gap-4 p-2"
                key={index}
              >
                <td className="text-end">{Math.ceil(index / 2 + 1)}.</td>
                <td className="">{encodeMove(player1Move)}</td>
                <td className="">{player2Move !== undefined ? encodeMove(player2Move) : null}</td>
              </TableRow>
            );
          }
        })}
      </TableBody>
      <TableFooter>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              options={{
                variant: 'outline',
              }}
              className="mr-0 ml-auto block w-full"
            >
              Share game state
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 border-none" align="start" side="top">
            <div className="flex [&>*:not(:first-child)]:-ml-px">
              {/* TODO: "url with copy button attached" is a pattern common enough that it warrants a component, especially since displaying the copy state tends to be annoying to do every time */}
              <Input
                className="border rounded py-1.5 h-auto "
                value={`${window.location.origin}?history=${encodeHistory(history)}`}
                readOnly
              />
              <Button
                className="whitespace-nowrap -ml-px"
                options={{ variant: 'outline' }}
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}?history=${encodeHistory(history)}`);
                }}
              >
                Copy link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </TableFooter>
    </Table>
  );
};

const HistoryControls = () => {
  const { history, setHistoryIndex, incrementHistoryIndex, decrementHistoryIndex } = useGameContext();

  return (
    <div>
      <Button
        options={{
          variant: 'outline',
        }}
        onClick={() => {
          if (history.length < 1) return;
          setHistoryIndex(1);
        }}
      >
        first
      </Button>
      <Button
        options={{
          variant: 'outline',
        }}
        onClick={decrementHistoryIndex}
      >
        prev.
      </Button>
      <Button
        options={{
          variant: 'outline',
        }}
        onClick={incrementHistoryIndex}
      >
        next
      </Button>
      <Button
        options={{
          variant: 'outline',
        }}
        onClick={() => {
          setHistoryIndex(history.length);
        }}
      >
        last
      </Button>
    </div>
  );
};

const CurrentTurn = () => {
  const { turn } = useGameContext();

  return <div>Current turn: {turn}</div>;
};

type NewGameButtonProps = Omit<UiButtonProps, 'onClick'>;
const NewGameButton = forwardRef<HTMLButtonElement, NewGameButtonProps>(({ ...buttonPassthrough }, ref) => {
  const { newGame } = useGameContext();

  return <Button ref={ref} onClick={newGame} {...buttonPassthrough} />;
});
NewGameButton.displayName = 'NewGameButton';

// TODO: this feels like a hack, maybe should be a hook conditionally called in GameContextProvider? But conditionally calling hooks feels like a hack too.
const LoadGameFromURL = () => {
  const searchParams = useSearchParams();
  const encodedHistory = searchParams.get('history');
  const { setHistory, setHistoryIndex } = useGameContext();

  useEffect(() => {
    const decodedHistory = encodedHistory ? decodeHistory(encodedHistory) : [];

    console.log('setting history,', decodedHistory);
    setHistory(decodedHistory);
    setHistoryIndex(decodedHistory.length);
  }, [encodedHistory, setHistory, setHistoryIndex]);

  return null;
};

interface GameContextData {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  turn: 'x' | 'o';
  setTurn: React.Dispatch<React.SetStateAction<'x' | 'o'>>;
  nextTurn: 'x' | 'o';
  passTurn: () => void;
  pieceToMove: Position | undefined;
  setPieceToMove: React.Dispatch<React.SetStateAction<Position | undefined>>;
  clearPieceToMove: () => void;
  history: MoveHistory;
  setHistory: React.Dispatch<React.SetStateAction<MoveHistory>>;
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  incrementHistoryIndex: () => void;
  decrementHistoryIndex: () => void;
  upToDate: boolean;
  setUpToDate: React.Dispatch<React.SetStateAction<boolean>>;
  gameLocked: boolean;
  setGameLocked: React.Dispatch<React.SetStateAction<boolean>>;
  attemptAction: (action: () => void) => void;
  moveRoutine: (move: Move) => void;
  newGame: () => void;
}

const GameContext = createContext<GameContextData | undefined>(undefined);

const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [turn, setTurn] = useState<'x' | 'o'>('x');
  const nextTurn = turn === 'x' ? 'o' : 'x';
  const passTurn = () => setTurn(nextTurn);

  const [pieceToMove, setPieceToMove] = useState<Position | undefined>(undefined);
  const clearPieceToMove = () => setPieceToMove(undefined);

  // before breaking this into a context, history started as decodedHistory
  const [history, setHistory] = useState<MoveHistory>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(history.length);
  const incrementHistoryIndex = () => {
    if (historyIndex === history.length) return;
    setHistoryIndex(historyIndex + 1);
  };
  const decrementHistoryIndex = () => {
    if (historyIndex === 0) return;
    setHistoryIndex(historyIndex - 1);
  };
  const [upToDate, setUpToDate] = useState<boolean>(true);
  const [gameLocked, setGameLocked] = useState(false);

  const [winner, setWinner] = useState<Sign | false>(false);

  const attemptAction = (action: () => void) => {
    if (gameLocked) return;
    action();
  };

  const moveRoutine = (move: Move) => {
    console.log('move', encodeMove(move));
    setHistory([...history, move]);
    if (upToDate) setHistoryIndex(historyIndex + 1);
    clearPieceToMove();
    passTurn();
  };

  const newGame = () => {
    setHistoryIndex(0);
    setHistory([]);
    setGameLocked(false);

    setTurn('x');
    clearPieceToMove();
  };

  useEffect(() => {
    setWinner(checkWinner(board));
  }, [board]);
  useEffect(() => {
    if (!winner) return;

    setGameLocked(true);
    console.log('🎉🎉 ', winner, ' wins 🎉🎉');
  }, [winner]);

  useEffect(() => {
    setGameLocked(false);
    if (historyIndex === history.length) return;
    setGameLocked(true);
  }, [historyIndex, history]);

  useEffect(() => {
    setBoard(computeBoardFromHistory(history, historyIndex));

    if (historyIndex === history.length) {
      setUpToDate(true);
    }

    if (historyIndex < history.length) {
      setUpToDate(false);
    }
  }, [history, historyIndex]);

  // Value object containing the shared data and functions
  const contextValue: GameContextData = {
    board,
    setBoard,
    turn,
    setTurn,
    nextTurn,
    passTurn,
    pieceToMove,
    setPieceToMove,
    clearPieceToMove,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    incrementHistoryIndex,
    decrementHistoryIndex,
    upToDate,
    setUpToDate,
    gameLocked,
    setGameLocked,
    attemptAction,
    moveRoutine,
    newGame,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

// Custom hook to access the context data
const useGameContext = (): GameContextData => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};

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
