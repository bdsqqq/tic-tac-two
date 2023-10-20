'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from './utils/cn';
import { buttonVariants } from './button';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

// TODO: add variants for common use cases
// like, skipDelayDuration, delayDuration,

// inheriting button styles for now
const _tooltipContentVariants = cva('z-50 outline-none animate-in', {
  variants: {
    size: {
      sm: 'w-fit max-w-[6rem] py-1 text-xs px-1.5 h-min',
      md: 'w-fit max-w-[12rem] py-1.5 px-2 h-min',
      lg: 'w-fit max-w-[24rem] py-3 px-4 h-min',
      full: 'w-full py-3 px-4 h-min',
    },
  },
  defaultVariants: {
    size: 'full',
  },
});

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  options?: VariantProps<typeof buttonVariants>;
}

// TODO: wrap this in Tooltip and TooltipTrigger as children for a reusable component w variants
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content ref={ref} className={cn(buttonVariants(options), className)} {...props} />
      </TooltipPrimitive.Portal>
    );
  }
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipPrimitive, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, buttonVariants };
