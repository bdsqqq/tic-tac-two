import { Dialog, DialogClose, DialogContent, DialogTitle } from '@haxiom/ui/dialog';
import type { ComponentProps, ReactNode } from 'react';
import { Label } from '@haxiom/ui/label';
import { Input, TextArea } from '@haxiom/ui/input';
import { Button } from '@haxiom/ui/button';
import { toast } from '@haxiom/ui/use-toast';
import { Info } from '@haxiom/ui/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';

/**
 * Use this a a controlled component or provide a DialogTrigger as a child to this component.
 */
export const NewDatasetDialog = ({ children, ...rest }: { children?: ReactNode } & ComponentProps<typeof Dialog>) => {
  return (
    <Dialog {...rest}>
      {children}
      <DialogContent>
        <DialogTitle>New Dataset</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({
              title: 'Pretend you created a dataset',
              description: "If you're seeing this, I didn't get through all my TODOs.",
            });
          }}
          className="flex flex-col gap-4"
        >
          <fieldset>
            <div className="relative w-min">
              <Label htmlFor="name">Name</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    options={{
                      variant: 'ghost',
                    }}
                    className="absolute -top-0.5 -right-3.5 p-0.5 hover:bg-transparent focus:bg-transparent ring-offset-0"
                  >
                    <Info className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[300px]" side="top">
                  <p>
                    {`
                      Dataset names must be between 1-80 characters, and may only contain ASCII alphanumeric characters and the '-', '_', '.' characters, and can not start or end with '-', '_', '.'.
                    `}
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <Input autoFocus className="ring-offset-0" id="name" placeholder="Triangle dataset..." />
          </fieldset>

          <fieldset>
            <Label htmlFor="name">Description</Label>
            <TextArea
              className="ring-offset-0 resize-none"
              id="name"
              placeholder="Looooooooogs from triangle company's site"
            />
          </fieldset>

          <div className="flex justify-between flex-row-reverse w-full">
            <Button type="submit">Create</Button>

            <DialogClose asChild>
              <Button
                options={{
                  variant: 'outline',
                }}
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
