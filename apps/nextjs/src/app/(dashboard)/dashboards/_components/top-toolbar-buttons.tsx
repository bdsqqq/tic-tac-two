'use client';

import { Button } from '@haxiom/ui/button';
import { DialogTrigger } from '@haxiom/ui/dialog';
import { NewDashboardDialog } from '~/app/(dashboard)/_components/new-dashboard-dialog';

export const NewDashboardButton = () => {
  return (
    <NewDashboardDialog>
      <DialogTrigger asChild>
        <Button
          className="h-9"
          options={{
            variant: 'outline',
          }}
        >
          New Dashboard
        </Button>
      </DialogTrigger>
    </NewDashboardDialog>
  );
};
