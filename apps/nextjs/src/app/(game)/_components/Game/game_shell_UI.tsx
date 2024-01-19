'use client';

import type { ButtonProps as UiButtonProps } from '@haxiom/ui/button';
import { Button } from '@haxiom/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@haxiom/ui/dialog';
import { Input } from '@haxiom/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';
import { Table, TableBody, TableFooter, TableRow } from '@haxiom/ui/table';
import { forwardRef, useEffect, useState } from 'react';
import { ConfirmPopover } from '~/app/(game)/_components/ConfirmPopover';
import { encodeHistory, encodeMove } from '~/lib/game-logic';
import { useGameContext } from '~/app/(game)/_components/Game/game_state';

export const WinDialog = () => {
  const [open, setOpen] = useState(false);
  const { winner } = useGameContext();

  useEffect(() => {
    if (!winner && open) setOpen(false);
    if (!winner) return;

    setOpen(true);
  }, [winner, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent className="flex flex-col justify-between">
        <DialogTitle className="text-2xl">{<>{winner}</>} wins!</DialogTitle>

        <div className="-mx-6 -mb-6 flex justify-between flex-row-reverse">
          <NewGameButton
            options={{
              size: 'lg',
            }}
          >
            New game
          </NewGameButton>
          <ShareGameStateButton
            options={{
              variant: 'outline',
              size: 'lg',
            }}
          >
            Share Replay
          </ShareGameStateButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const Score = () => {
  const { score } = useGameContext();

  return (
    <div className="flex gap-2">
      <div>o: {score.o}</div>
      <div>x: {score.x}</div>
    </div>
  );
};

export const History = () => {
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

export const HistoryControls = () => {
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

export const CurrentTurn = () => {
  const { turn } = useGameContext();

  return <div>Current turn: {turn}</div>;
};

type NewGameButtonProps = Omit<UiButtonProps, 'onClick'> & {
  requireConfirmation?: boolean;
};
export const NewGameButton = forwardRef<HTMLButtonElement, NewGameButtonProps>(
  ({ requireConfirmation, ...buttonPassthrough }, ref) => {
    const { newGame } = useGameContext();

    if (requireConfirmation)
      return (
        <ConfirmPopover feedback={<>Are you sure?</>}>
          <Button ref={ref} onClick={newGame} {...buttonPassthrough} />
        </ConfirmPopover>
      );

    return <Button ref={ref} onClick={newGame} {...buttonPassthrough} />;
  }
);
NewGameButton.displayName = 'NewGameButton';

type ResetScoreButtonProps = Omit<UiButtonProps, 'onClick'>;
export const ResetScoreButton = forwardRef<HTMLButtonElement, ResetScoreButtonProps>(
  ({ ...buttonPassthrough }, ref) => {
    const { resetScore } = useGameContext();

    return (
      // TODO: allow passing aria stuff to cancel and confirm buttons
      <ConfirmPopover feedback={<>Are you sure?</>}>
        <Button ref={ref} onClick={resetScore} {...buttonPassthrough} />
      </ConfirmPopover>
    );
  }
);
ResetScoreButton.displayName = 'ResetScoreButton';

type ShareGameStateButtonProps = Omit<UiButtonProps, 'onClick'>;
export const ShareGameStateButton = forwardRef<HTMLButtonElement, ShareGameStateButtonProps>(
  ({ ...buttonPassthrough }, ref) => {
    const { history } = useGameContext();

    return (
      <Button
        ref={ref}
        onClick={async () => {
          await navigator.clipboard.writeText(`${window.location.origin}?history=${encodeHistory(history)}`);
        }}
        {...buttonPassthrough}
      />
    );
  }
);
ShareGameStateButton.displayName = 'ShareGameStateButton';
