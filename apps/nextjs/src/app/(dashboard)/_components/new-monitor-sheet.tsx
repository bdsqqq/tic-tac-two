'use client';

import { Sheet, SheetClose, SheetContent, SheetTitle } from '@haxiom/ui/sheet';
import type { ComponentProps, ReactNode } from 'react';
import { Input, TextArea } from '@haxiom/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@haxiom/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@haxiom/ui/button';
import { mockAction } from '../_utils';
import { useForm } from 'react-hook-form';
import { FormDevTool } from '~/components/hookform-devtool';

const MAX_DESCRIPTION_LENGTH = 400;

const formSchema = z.object({
  name: z.string().nonempty('Please provide a name for your monitor.'),
  description: z.string().max(MAX_DESCRIPTION_LENGTH, 'Please keep your description under 400 characters.'),
});

/**
 * Use this a a controlled component or provide a SheetTrigger as a child to this component.
 */
export const NewMonitorSheet = ({ children, ...rest }: { children?: ReactNode } & ComponentProps<typeof Sheet>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mockAction('Created a monitor called ' + values.name);
  }

  function hasRadixIgnoreAttribute(node: HTMLElement | SVGElement | null): boolean {
    if (!node) {
      console.log('not a node');
      return false;
    }

    // Check if the current node has the data-attribute "radix-ignore"
    if (node.hasAttribute('data-radix-ignore')) {
      console.log('found');
      return true;
    }

    // If the current node doesn't have the attribute, check its parent node recursively
    console.log('recursing');
    return hasRadixIgnoreAttribute(node.parentElement);
  }

  return (
    <Sheet {...rest}>
      {children}
      <SheetContent
        onInteractOutside={(e) => {
          console.log();
          // if target element has data-radix-ignore, don't close

          if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
            if (hasRadixIgnoreAttribute(e.target)) {
              e.preventDefault();
              return;
            }
          }
        }}
      >
        <SheetTitle>New Monitor</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="ring-offset-0" placeholder="Triangle sells..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <TextArea
                      className="ring-offset-0 resize-none"
                      {...field}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      placeholder="keep track of how many people buy triangles from the Triangle company..."
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Max {MAX_DESCRIPTION_LENGTH} characters.</span>{' '}
                    <span className="tabular-nums">
                      {field.value.length}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between flex-row-reverse w-full">
              <Button type="submit">Create</Button>

              <SheetClose asChild>
                <Button
                  options={{
                    variant: 'outline',
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>

        <FormDevTool control={form.control} />
      </SheetContent>
    </Sheet>
  );
};
