'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { EMPTY_BOARD, encodeMove, checkWinner, computeBoardFromHistory, decodeHistory } from '@haxiom/game-logic/core';
import type { Board, Move, MoveHistory, Position, Sign } from '@haxiom/game-logic/core';

export interface GameContextData {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  turn: 'x' | 'o';
  setTurn: React.Dispatch<React.SetStateAction<'x' | 'o'>>;
  nextTurn: 'x' | 'o';
  passTurn: () => void;

  // Should probably be handled elsewhere. This is a UI concern.
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
  winner: Sign | false;
  score: Score;
  resetScore: () => void;
}

export type Score = Record<Sign, number>;
export const EMPTY_SCORE = {
  x: 0,
  o: 0,
};

export const GameContext = createContext<GameContextData | undefined>(undefined);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
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

  const [score, setScore] = useState<Score>(EMPTY_SCORE);

  const incrementScore = (prev: Score, target: Sign): Score => {
    return {
      ...prev,
      [target]: prev[target] + 1,
    };
  };

  useEffect(() => {
    if (!winner) return;

    setScore((prev) => incrementScore(prev, winner));
  }, [winner]);

  const resetScore = () => {
    setScore(EMPTY_SCORE);
  };

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
    winner,
    score,
    resetScore,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

// Custom hook to access the context data
export const useGameContext = (): GameContextData => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};

// TODO: this feels like a hack, maybe should be a hook conditionally called in GameContextProvider? But conditionally calling hooks feels like a hack too.
export const LoadGameFromURL = () => {
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
