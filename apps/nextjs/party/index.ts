import type * as Party from 'partykit/server';
import { Game } from '@haxiom/game-logic';
import { decodeMove } from '@haxiom/game-logic/core';

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  game = new Game();

  encodedGameState = () => {
    return JSON.stringify(this.game.exposeState());
  };

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send(this.encodedGameState());
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...

    const newGameState = this.game.makeMove(decodeMove(message));

    this.room.broadcast(
      JSON.stringify(newGameState)
      // ...except for the connection it came from
      // [sender.id]
    );
  }
}

Server satisfies Party.Worker;
