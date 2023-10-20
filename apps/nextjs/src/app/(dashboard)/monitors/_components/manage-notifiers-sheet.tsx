import { Sheet, SheetContent, SheetTitle } from '@haxiom/ui/sheet';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Use this a a controlled component or provide a SheetTrigger as a child to this component.
 */
export const ManageNotifiersSheet = ({
  children,
  ...rest
}: { children?: ReactNode } & ComponentProps<typeof Sheet>) => {
  return (
    <Sheet {...rest}>
      {children}
      <SheetContent>
        <SheetTitle>Manage notifiers</SheetTitle>
      </SheetContent>
    </Sheet>
  );
};
