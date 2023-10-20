'use client';

import { Button } from '@haxiom/ui/button';
import { Braces } from '@haxiom/ui/icons';
import { toast } from '@haxiom/ui/use-toast';

export const FieldListButton = () => {
  return (
    <Button
      options={{
        variant: 'outline',
        size: 'icon',
      }}
      onClick={() => {
        toast({
          title: 'Pretend you opened the field list',
          description: "If you're seeing this, I didn't get through all my TODOs.",
        });
      }}
    >
      <Braces className="h-4 w-4" />
    </Button>
  );
};
