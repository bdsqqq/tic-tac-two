'use client';
import usePartySocket from 'partysocket/react';

import { Board, Game } from '~/app/(game)/_components/Game/game_UI';
import {
  CurrentTurn,
  History,
  HistoryControls,
  NewGameButton,
  ResetScoreButton,
  Score,
  WinDialog,
} from '~/app/(game)/_components/Game/game_shell_UI';
import { LoadGameFromURL } from '~/app/(game)/_components/Game/game_state';

export const runtime = 'edge';

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
    },
    onClose() {
      console.log('closed');
    },
    onError(e) {
      console.log('error');
    },
  });

  return (
    <div className="flex flex-col gap-12">
      <h1>
        Room: {params.room_id} - {ws.id}
      </h1>
      <main className="flex flex-col md:flex-row md:justify-between gap-8">
        <Game>
          <WinDialog />
          <LoadGameFromURL />
          <div className="shrink-0 w-fit mx-auto">
            <Board />
          </div>

          <div className="flex flex-col justify-between shrink">
            <Score />
            <CurrentTurn />
            <History />
            <HistoryControls />

            <div className="flex flex-col gap-4">
              <p className="w-full">{DESCRIPTION}</p>
              <div className="flex justify-between">
                <ResetScoreButton
                  options={{
                    variant: 'outline',
                  }}
                >
                  Reset Score
                </ResetScoreButton>
                <NewGameButton requireConfirmation>New game</NewGameButton>
              </div>
            </div>
          </div>
        </Game>
      </main>
    </div>
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
