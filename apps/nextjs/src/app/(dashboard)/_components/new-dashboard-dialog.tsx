import { Dialog, DialogClose, DialogContent, DialogTitle } from '@haxiom/ui/dialog';
import type { ComponentProps, ReactNode } from 'react';
import { Label } from '@haxiom/ui/label';
import { Input, TextArea } from '@haxiom/ui/input';
import { Button } from '@haxiom/ui/button';
import { toast } from '@haxiom/ui/use-toast';

/**
 * Use this a a controlled component or provide a DialogTrigger as a child to this component.
 */
export const NewDashboardDialog = ({ children, ...rest }: { children?: ReactNode } & ComponentProps<typeof Dialog>) => {
  return (
    <Dialog {...rest}>
      {children}
      <DialogContent>
        <DialogTitle>New Dashboard</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({
              title: 'Pretend you created a dashboard',
              description: "If you're seeing this, I didn't get through all my TODOs.",
            });
          }}
          className="flex flex-col gap-4"
        >
          <fieldset>
            <Label htmlFor="name">Name</Label>
            <Input className="ring-offset-0" id="name" placeholder="Triangle site..." />
          </fieldset>

          <fieldset>
            <Label htmlFor="name">Description</Label>
            <TextArea
              className="ring-offset-0 resize-none"
              id="name"
              placeholder="Quick insights about triangle company's site"
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
