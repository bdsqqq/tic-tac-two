'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from './utils/cn';
import { omit, pick } from './utils/fn';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverClose = PopoverPrimitive.Close;

const popoverContentVariants = cva(
  'z-50 min-w-[8rem] border bg-subtle text shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 focus:ring-offset-0',
  {
    variants: {
      size: {
        sm: 'w-24 p-1 text-xs h-min',
        md: 'w-48 p-1.5 h-min',
        lg: 'w-96 p-3 h-min',
        full: 'w-full p-3 h-min',
      },
      // i added these here so we could have a uniform api
      // (alternative: options -> variants and props -> radix options)
      align: {
        start: 'start',
        center: 'center',
        end: 'end',
      },
      side: {
        top: 'top',
        right: 'right',
        bottom: 'bottom',
        left: 'left',
      },
    },
    defaultVariants: {
      size: 'full',
      align: 'center',
      side: 'bottom',
    },
  }
);

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  options?: PopoverContentOptions;
}

type RealVariantProps = Omit<VariantProps<typeof popoverContentVariants>, 'align' | 'side'>;
type PopoverContentOptions = RealVariantProps & PopoverPrimitive.PopperContentProps;

const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  ({ className, options, ...props }, ref) => {
    // annoying, but we need to split the options into radix and cva options.
    // ts is not smart enough to generate the strings for us so we'll have to maintain this or find a better way
    const radixOptions = pick(options!, 'align', 'side');
    const cvaOptions = omit(options!, 'align', 'side') as RealVariantProps;

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          className={cn(popoverContentVariants(cvaOptions), className)}
          {...radixOptions}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// ALTERNATIVE
const popoverContentVariants2 = cva('z-50 outline-none animate-in', {
  variants: {
    size: {
      sm: 'w-24 py-1 text-xs px-1.5 h-min',
      md: 'w-48 py-1.5 px-2 h-min',
      lg: 'w-96 py-3 px-4 h-min',
      full: 'w-full py-3 px-4 h-min',
    },
  },
  defaultVariants: {
    size: 'full',
  },
});

export interface PopoverContentProps2 extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  options?: VariantProps<typeof popoverContentVariants>;
}

const PopoverContent2 = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps2>(
  ({ className, options, ...props }, ref) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content ref={ref} className={cn(popoverContentVariants(options), className)} {...props} />
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent2.displayName = PopoverPrimitive.Content.displayName;

export {
  Popover,
  PopoverTrigger,
  PopoverClose,
  PopoverContent,
  PopoverContent2,
  popoverContentVariants,
  popoverContentVariants2,
};
