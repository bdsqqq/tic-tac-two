'use client';

import { Checkbox } from '@haxiom/ui/checkbox';
import { Pin, Settings } from '@haxiom/ui/icons';
import { Toggle } from '@haxiom/ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';

import { create } from 'zustand';
import React, { useState } from 'react';

interface DebugState {
  hasABunchOfAccesses: boolean;
  toggle: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  hasABunchOfAccesses: true,
  toggle: () => set((state) => ({ hasABunchOfAccesses: !state.hasABunchOfAccesses })),
}));

export function Debugger() {
  const [keepOpen, setKeepOpen] = useState(false);
  const toggleKeepOpen = () => setKeepOpen((state) => !state);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((state) => !state);

  return (
    <Popover open={open || keepOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild data-radix-ignore="true">
        <Toggle
          pressed={open}
          options={{
            variant: 'outline',
          }}
          className="opacity-0 hover:opacity-100 focus:opacity-100 fixed bottom-4 right-4 data-[state=open]:opacity-100 z-[100] pointer-events-auto"
        >
          <Settings className="h-4 w-4" />
        </Toggle>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={-1}
        align="end"
        className="flex flex-col p-4 z-[100] relative pointer-events-auto"
        data-radix-ignore="true"
      >
        <Toggle
          // 34px so the border of the two toggles lines up
          className="-bottom-9 right-[34px] absolute pointer-events-auto"
          options={{
            variant: 'outline',
          }}
          pressed={keepOpen}
          onPressedChange={toggleKeepOpen}
        >
          <Pin className="h-4 w-4" />
        </Toggle>
        <ABunchOfAccessesToggler />
      </PopoverContent>
    </Popover>
  );
}

const ABunchOfAccessesToggler = () => {
  const { hasABunchOfAccesses, toggle } = useDebugStore();

  return (
    <div className="flex gap-2 items-center pointer-events-auto">
      <Checkbox checked={hasABunchOfAccesses} onClick={toggle} className="pointer-events-auto" />
      Has a bunch of accesses
    </div>
  );
};
