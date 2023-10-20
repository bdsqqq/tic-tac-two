import { cn } from '@haxiom/ui';
import type { ReactNode } from 'react';
import { MAX_WIDTH_CLASS } from '../_constants';

export const TopToolBar = ({ children, className }: { children?: ReactNode; className?: string }) => {
  return (
    <div className="h-16 border-b border-subtle sticky top-12 z-20">
      <div className={cn('flex h-full items-center bg', MAX_WIDTH_CLASS, className)}>{children}</div>
    </div>
  );
};
