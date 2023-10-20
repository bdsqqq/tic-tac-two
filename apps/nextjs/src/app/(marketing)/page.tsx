'use client';
import { useState } from 'react';

export const runtime = 'edge';

const EMPTY_BOARD = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

export default function Home() {
  const [board, setBoard] = useState<('X' | 'O' | undefined)[]>(EMPTY_BOARD);
  const [turn, setTurn] = useState<'X' | 'O'>('X');

  const nextTurn = turn === 'X' ? 'O' : 'X';

  return (
    <main className="">
      <div className="w-fit grid grid-cols-3 grid-rows-3 gap-4">
        {board.map((cell, index) => (
          <button
            onClick={(e) => {
              e.preventDefault();
              const newBoard = [...board];
              newBoard[index] = turn;
              setBoard(newBoard);
              setTurn(nextTurn);
            }}
            key={index}
            className="bg-gray-3 w-40 h-40"
          >
            {cell}
          </button>
        ))}
      </div>
    </main>
  );
}
