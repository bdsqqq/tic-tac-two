'use client';

import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@haxiom/ui';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import {
  assertPosition,
  assertPositionOr,
  isValidMove,
  makeGenerativeMove,
  shouldMoveBeGenerative,
} from '@haxiom/game-logic/core';
import { GameContextProvider, useGameContext } from '~/app/(game)/_components/Game/game_state';

export const Cell = ({
  children,
  highlight,
  uid,
  ...rest
}: React.HTMLProps<HTMLDivElement> & {
  children: React.ReactNode;
  highlight: boolean;
  uid: string;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: uid,
  });

  return (
    <div
      ref={setNodeRef}
      {...rest}
      className={cn('bg-gray-3 p-2 rounded w-40 h-40', highlight && 'bg-gray-9', isOver && 'bg-gray-5')}
    >
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

const Piece = forwardRef<HTMLButtonElement, ButtonProps & { uid: string }>(
  ({ uid, children, disabled, ...rest }, ref) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: uid,
      disabled: disabled,
    });
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    const composedRefs = useComposedRefs(
      setNodeRef as (element: HTMLButtonElement) => void, // can't figure out how to make draggable be a HTMLButtonElement instead of an HTMLElement so casting it
      ref
    );

    return (
      <button
        className="flex justify-center items-center bg-subtle rounded-md h-full w-full touch-none select-none"
        ref={composedRefs}
        style={style}
        disabled={disabled}
        {...listeners}
        {...attributes}
        {...rest}
      >
        <div className="font-bold text-7xl">{children}</div>
      </button>
    );
  }
);
Piece.displayName = 'Piece';

const StaticPiece = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  return (
    <button
      className="flex justify-center items-center bg-subtle rounded-md h-full w-full touch-none select-none"
      ref={ref}
      {...rest}
    >
      <div className="font-bold text-7xl">{children}</div>
    </button>
  );
});
StaticPiece.displayName = 'NonDraggablePiece';

export const Board = () => {
  const { board, turn, pieceToMove, setPieceToMove, clearPieceToMove, upToDate, attemptAction, moveRoutine } =
    useGameContext();
  // TODO: BOARD SHOULD GET ALL OF THESE AS PROPS, NOT FROM CONTEXT.
  // So if we can hook it up with context, we can,
  // but also could hook it up with ANY OTHER STATE MANAGEMENT
  // eg: Server managed state, or local with zustand/context etc.

  return (
    <DndContext
      onDragEnd={(e) => {
        // 🐉🐉🐉 Brittle, depends on ID having a structure of sign-from.
        // TODO: make id generation & deconstruction into functions
        const sign = e.active.id.toString().split('')[0];
        const from = e.active.id.toString().split('')[2];
        const to = e.over?.id.toString().split('').at(-1);

        // Check if currentTurn matches sign
        if (sign !== turn) return;

        if (!sign || !from || !to) return;

        const intFrom = parseInt(from);
        const intTo = parseInt(to);

        assertPositionOr(intFrom);
        assertPosition(intTo);

        const move = { from: intFrom, sign: sign, to: intTo };

        if (!isValidMove(board, move)) return;

        attemptAction(() => {
          moveRoutine(move);
        });
        console.log('dragEnd', e);
      }}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-fit gap-2">
        {board.map((cell, index) => (
          <Cell uid={`cell-${index}`} key={index} highlight={upToDate && pieceToMove === index}>
            {cell !== undefined ? (
              turn === cell ? (
                <Piece
                  // TODO: figure out how to add a delay to dragging.
                  // TODO: figure out how to let onClick happen if user taps but doesn't drag.
                  draggable={turn === cell}
                  disabled={turn !== cell}
                  aria-disabled={turn !== cell}
                  uid={`${cell}-${index}`}
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
                <StaticPiece disabled={turn != cell} aria-disabled={turn != cell}>
                  {cell}
                </StaticPiece>
              )
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
    </DndContext>
  );
};

export const Game = ({ children }: { children: ReactNode }) => {
  return <GameContextProvider>{children}</GameContextProvider>;
};
