'use client';

import { cn } from '@haxiom/ui';
import { Button } from '@haxiom/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@haxiom/ui/dialog';
import { FunctionSquare } from '@haxiom/ui/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@haxiom/ui/sheet';
import { usePathname } from 'next/navigation';

export const VirtualFieldsButton = () => {
  const pathname = usePathname();

  const urlSegments = pathname.split('/');
  const datasetIdFromUrl = urlSegments[urlSegments.indexOf('datasets') + 1];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          options={{
            variant: 'outline',
            size: 'icon',
          }}
          className={cn(!datasetIdFromUrl ? 'hidden' : '')}
        >
          <FunctionSquare className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-row justify-between items-center">
          <SheetTitle>Virtual fields</SheetTitle>
          <AddVirtualField />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const AddVirtualField = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          options={{
            variant: 'outline',
          }}
        >
          Add virtual field
        </Button>
      </DialogTrigger>
      <DialogContent>form</DialogContent>
    </Dialog>
  );
};
