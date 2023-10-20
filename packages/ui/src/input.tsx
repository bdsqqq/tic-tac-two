import * as React from 'react';

import { cn } from './utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full border border-subtle bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-7 aria-[invalid=true]:ring-red-8',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex h-24 w-full border border-subtle bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-7 aria-[invalid=true]:ring-red-8',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
TextArea.displayName = 'TextArea';

export { Input, TextArea };
