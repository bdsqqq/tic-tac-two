import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from './utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border',
        ghost: '',
        link: 'underline-offset-2 underline',
      },
      intent: {
        primary: '',
        destructive: '',
      },
      size: {
        sm: 'min-h-6 py-1 text-xs px-1.5 h-min',
        md: 'min-h-8 py-1.5 px-2 h-min',
        lg: 'min-h-10 py-3 px-4 h-min',
        icon: 'h-9 w-9',
      },
    },
    compoundVariants: [
      {
        variant: ['solid'],
        intent: 'primary',
        class:
          'bg-gray-12 hover:bg-gray-11 focus-visible:bg-gray-11 active:bg-gray-10 text-gray-1 aria-disabled:text-gray-3',
      },
      {
        variant: ['solid'],
        intent: 'destructive',
        class: 'bg-red-9 hover:bg-red-10 focus-visible:bg-red-10 text-red-1 aria-disabled:text-red-1',
      },

      {
        variant: ['outline'],
        intent: 'primary',
        class:
          'text-gray-12 border-gray-7 hover:border-gray-8 focus-visible:border-gray-8 bg-transparent hover:bg-grayA-2 focus-visible:bg-grayA-2',
      },
      {
        variant: ['outline'],
        intent: 'destructive',
        class:
          'text-red-9 border-red-9 hover:border-red-10 focus-visible:border-red-10 bg-transparent hover:bg-redA-3 focus-visible:bg-redA-3',
      },

      {
        variant: ['ghost'],
        intent: 'primary',
        class: 'text-gray-12 bg-transparent hover:bg-gray-4 focus-within:bg-gray-4',
      },
      {
        variant: ['ghost'],
        intent: 'destructive',
        class: 'text-red-9 bg-transparent hover:text-red-10 hover:bg-redA-3 focus-within:bg-redA-3',
      },

      {
        variant: ['link'],
        intent: 'primary',
        class: 'text-gray-12 bg-transparent hover:bg-gray-4 focus-within:bg-gray-4',
      },
      {
        variant: ['link'],
        intent: 'destructive',
        class: 'text-red-9 bg-transparent hover:text-red-10 hover:bg-redA-3 focus-within:bg-redA-3',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      variant: 'solid',
      size: 'md',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options?: VariantProps<typeof buttonVariants>;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, options, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return <Comp className={cn(buttonVariants(options), className)} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
