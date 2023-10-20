'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from './utils/cn';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const portalVariants = cva('fixed inset-0 z-50 flex', {
  variants: {
    position: {
      top: 'items-start',
      bottom: 'items-end',
      left: 'justify-start',
      right: 'justify-end',
    },
  },
  defaultVariants: { position: 'right' },
});

interface SheetPortalProps extends SheetPrimitive.DialogPortalProps, VariantProps<typeof portalVariants> {}

const SheetPortal = ({ position, className, children, ...props }: SheetPortalProps) => (
  <SheetPrimitive.Portal className={cn(className)} {...props}>
    <div className={portalVariants({ position })}>{children}</div>
  </SheetPrimitive.Portal>
);
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & {
  blur?: boolean;
};

const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, SheetOverlayProps>(
  ({ className, blur = true, ...props }, ref) => (
    <SheetPrimitive.Overlay
      className={cn(
        'bg/80 fixed inset-0 z-50 transition-all duration-fast-01 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
        blur && 'backdrop-blur-sm',
        className
      )}
      {...props}
      ref={ref}
    />
  )
);
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva('fixed z-50 scale-100 gap-4 bg p-6 opacity-100 shadow-lg border', {
  variants: {
    position: {
      top: 'animate-in slide-in-from-top w-full duration-moderate-01',
      bottom: 'animate-in slide-in-from-bottom w-full duration-moderate-01',
      left: 'animate-in slide-in-from-left h-full duration-moderate-01',
      right: 'animate-in slide-in-from-right h-full duration-moderate-01',
    },
    size: {
      content: '',
      default: '',
      sm: '',
      lg: '',
      xl: '',
      full: '',
    },
  },
  compoundVariants: [
    {
      position: ['top', 'bottom'],
      size: 'content',
      class: 'max-h-screen',
    },
    {
      position: ['top', 'bottom'],
      size: 'default',
      class: 'h-1/3',
    },
    {
      position: ['top', 'bottom'],
      size: 'sm',
      class: 'h-1/4',
    },
    {
      position: ['top', 'bottom'],
      size: 'lg',
      class: 'h-1/2',
    },
    {
      position: ['top', 'bottom'],
      size: 'xl',
      class: 'h-5/6',
    },
    {
      position: ['top', 'bottom'],
      size: 'full',
      class: 'h-screen',
    },
    {
      position: ['right', 'left'],
      size: 'content',
      class: 'max-w-screen',
    },
    {
      position: ['right', 'left'],
      size: 'default',
      class: 'w-1/3',
    },
    {
      position: ['right', 'left'],
      size: 'sm',
      class: 'w-1/4',
    },
    {
      position: ['right', 'left'],
      size: 'lg',
      class: 'w-1/2',
    },
    {
      position: ['right', 'left'],
      size: 'xl',
      class: 'w-5/6',
    },
    {
      position: ['right', 'left'],
      size: 'full',
      class: 'w-screen',
    },
  ],
  defaultVariants: {
    position: 'right',
    size: 'default',
  },
});

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  options?: VariantProps<typeof sheetVariants> & {
    blur?: boolean;
  };
}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, DialogContentProps>(
  ({ options, className, children, ...props }, ref) => (
    <SheetPortal position={options?.position}>
      <SheetOverlay blur={options?.blur} />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants(options), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="ring-offset-background data-[state=open]:bg-secondary absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('text text-lg font-semibold', className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-subtle text-sm', className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

const SheetClose = SheetPrimitive.Close;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
