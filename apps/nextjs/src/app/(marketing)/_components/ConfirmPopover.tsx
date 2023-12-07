'use client';

import { Button } from '@haxiom/ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';
import React, { Children, cloneElement, forwardRef, isValidElement } from 'react';

/**
 * Known issue: this looks at the onClick prop of the children, like, actual children, not what is resolved.
 * ```
 * const Something = () => <button onClick={...} />
 * <ConfirmPopover><Something /></ConfirmPopover>
 * ```
 * Doesn't work because Something.props.children is undefined.
 *
 * @see: https://github.com/radix-ui/primitives/pull/2234#issuecomment-1613000587
 */
export const ConfirmPopover = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    feedback: React.ReactNode;
  }>
>(({ children, feedback, ...rest }, ref) => {
  const child = Children.only(children);

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
      <PopoverContent align="start">
        <div className="flex flex-col gap-2">
          {feedback}
          <div className="flex -mx-3 -mb-3">
            <PopoverClose asChild>
              <Button
                options={{
                  variant: 'outline',
                }}
                className="grow"
              >
                Cancel
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button className="grow" onClick={child.props.onClick}>
                Confirm
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
ConfirmPopover.displayName = 'ConfirmPopover';
