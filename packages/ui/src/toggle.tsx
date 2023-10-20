'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from './utils/cn';

const toggleVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-colors hover:bg-element-hover text-subtle disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-element-active data-[state=on]:text data-[state=open]:bg-element-active data-[state=open]:text',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-element-active hover:text',
      },
      size: {
        sm: 'min-h-6 py-1 text-xs px-1.5 h-min',
        md: 'min-h-8 py-1.5 px-2 h-min',
        lg: 'min-h-10 py-3 px-4 h-min',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'icon',
    },
  }
);

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  options?: VariantProps<typeof toggleVariants>;
}

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, options, ...props }, ref) => (
    <TogglePrimitive.Root ref={ref} className={cn(toggleVariants(options), className)} {...props} />
  )
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
