'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';
import React, { Children, cloneElement, forwardRef, isValidElement } from 'react';

/**
 * @see: https://github.com/radix-ui/primitives/pull/2234#issuecomment-1613000587
 */
export const Lock = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    locked: boolean;
    lockedFeedback: React.ReactNode;
  }>
>(({ children, locked, lockedFeedback, ...rest }, ref) => {
  const child = Children.only(children);
  if (!locked) return <>{child}</>;

  // Not too happy about this bit, but it makes sure cloneElement gets a valid element (not a string and other misc types allowed by ReactNode)
  const isValid = isValidElement<HTMLButtonElement & { href?: string; onClick?: () => void }>(child);
  if (!isValid) throw new Error(`Lock's child must be a valid react element, see: `);

  return (
    <Popover>
      <PopoverTrigger asChild {...rest} ref={ref}>
        {cloneElement(child, {
          href: '#', // 👺👺👺 This gives href to anything, things that are not links. Didn't cause issues yet but be wary.
          onClick: () => {
            // no op
          },
        })}
      </PopoverTrigger>
      <PopoverContent align="end">{lockedFeedback}</PopoverContent>
    </Popover>
  );
});
Lock.displayName = 'Lock';
