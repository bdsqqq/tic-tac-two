'use client';
import type { Board, Sign } from '@haxiom/game-logic/core';
import { makeTextBoard } from '@haxiom/game-logic/util';
import { encodeMove } from '@haxiom/game-logic/core';
import usePartySocket from 'partysocket/react';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function Home({ params }: { params: { room_id: string } }) {
  const ws = usePartySocket({
    // usePartySocket takes the same arguments as PartySocket.
    host: 'localhost:1999', // or localhost:1999 in dev
    room: params.room_id,

    // in addition, you can provide socket lifecycle event handlers
    // (equivalent to using ws.addEventListener in an effect hook)
    onOpen() {
      console.log('connected');
    },
    onMessage(e) {
      console.log('message', e.data);

      const data = JSON.parse(e.data);
      setBoard(data.board);
      setScore(data.score);
      setTurn(data.turn);
    },
    onClose() {
      console.log('closed');
    },
    onError(e) {
      console.log('error', e);
    },
  });

  const [board, setBoard] = useState<Board | undefined>();
  const [score, setScore] = useState<Record<Sign, number> | undefined>();
  const [turn, setTurn] = useState<Sign | undefined>();

  return (
    <div className="flex flex-col gap-12">
      <h1>
        Room: {params.room_id} - {ws.id}
      </h1>
      <main className="flex flex-col md:flex-row md:justify-between gap-8">
        <button
          onClick={() => {
            ws.send(encodeMove({ from: 0, sign: 'x', to: 1 }));
          }}
        >
          Hej
        </button>

        <pre>
          <code>{board ? makeTextBoard(board) : 'No board yet'}</code>
        </pre>
      </main>
    </div>
  );
}
