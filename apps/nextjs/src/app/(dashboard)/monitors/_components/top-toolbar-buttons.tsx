'use client';

import { Button } from '@haxiom/ui/button';
import { SheetTrigger } from '@haxiom/ui/sheet';
import { ManageNotifiersSheet } from '~/app/(dashboard)/monitors/_components/manage-notifiers-sheet';

export const ManageNotifiersButton = () => {
  return (
    <ManageNotifiersSheet>
      <SheetTrigger asChild>
        <Button
          className="h-9"
          options={{
            variant: 'outline',
          }}
        >
          Manage notifiers
        </Button>
      </SheetTrigger>
    </ManageNotifiersSheet>
  );
};
