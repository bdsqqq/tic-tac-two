'use client';

import { useState } from 'react';
import { add, addDays, addHours, addMinutes, format } from 'date-fns';
import { z } from 'zod';

import type { DateRange } from '@haxiom/ui/calendar';
import { Calendar } from '@haxiom/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@haxiom/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';
import { useToast } from '@haxiom/ui/use-toast';
import { useZodForm } from '~/lib/zod-form';
import { Button } from '@haxiom/ui/button';
import { cn } from '@haxiom/ui';

const quickRanges = [
  { unit: 'm', value: [5, 15, 30] },
  { unit: 'hr', value: [1, 3, 6] },
  { unit: 'd', value: [1, 2, 7, 15, 30, 90] },
] as const;

// Define the function toFormat
const toFormat = (
  from: Date,
  quickrange: (typeof quickRanges)[number]['value'][number],
  unit: (typeof quickRanges)[number]['unit']
) => {
  let to: Date;

  switch (unit) {
    case 'm':
      to = addMinutes(from, quickrange);
      break;
    case 'hr':
      to = addHours(from, quickrange);
      break;
    case 'd':
      to = addDays(from, quickrange);
      break;
    default:
      throw new Error('Invalid quickrange unit');
  }

  return { from, to };
};

quickRanges.forEach((range) => {
  range.value.forEach((value) => {
    console.log(toFormat(new Date(), value, range.unit));
  });
});

const formatQuickRange = ({ range, unit }: { range: number; unit: string }) => {
  const longUnit = unit === 'm' ? 'min' : unit === 'hr' ? 'hr' : 'day';
  const processedUnit = range > 1 ? `${longUnit}s` : longUnit;
  return `${range} ${processedUnit}`;
};

export const createApiKeySchema = z.object({
  quickRange: z
    .object({
      unit: z.union([z.literal('m'), z.literal('hr'), z.literal('d')]),
      value: z.union([
        z.literal(5),
        z.literal(15),
        z.literal(30),
        z.literal(1),
        z.literal(3),
        z.literal(6),
        z.literal(1),
        z.literal(2),
        z.literal(7),
        z.literal(15),
        z.literal(30),
        z.literal(90),
      ]),
    })
    .optional(),
  fullRange: z.union([
    z.object({
      from: z.union([z.date(), z.undefined()]),
      to: z.union([z.date(), z.undefined()]),
    }),
    z.undefined(),
  ]),
});

const createApiKey = async (data: CreateApiKey) => {
  // fake request for testing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data) {
        resolve('Async operation complete!');
      } else {
        reject(new Error('Async operation failed!'));
      }
    }, 1000);
  });
};

export type CreateApiKey = z.infer<typeof createApiKeySchema>;

export const TimeRange = ({ dark = false }) => {
  const [calIsOpen, setCalIsOpen] = useState(false);
  const toaster = useToast();

  const form = useZodForm({
    schema: createApiKeySchema,
    defaultValues: { quickRange: undefined, fullRange: undefined },
  });

  async function onSubmit(data: CreateApiKey) {
    try {
      await createApiKey(data);

      form.reset();
      toaster.toast({
        title: 'Date range Changed',
        description: data.quickRange
          ? `Changed to ${formatQuickRange({ unit: data.quickRange.unit, range: data.quickRange.value })}`
          : data?.fullRange?.from && data?.fullRange?.to
          ? `Changed to ${format(data.fullRange.from, 'MMM d, yyyy')} - ${format(data.fullRange.to, 'MMM d, yyyy')}`
          : '',
      });
    } catch (error) {
      toaster.toast({
        title: 'Error changing date range',
        variant: 'destructive',
        description: 'An issue occurred while making your query. Please try again.',
      });
    } finally {
      setCalIsOpen(false);
    }
  }

  return (
    <Form {...form}>
      <Popover open={calIsOpen} onOpenChange={setCalIsOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button className="gap-2" options={{ size: 'sm', variant: 'outline' }}>
              <ClockSVG />
              Jul 10, 12:20 PM - Jul 10, 12:20 PM
              <DownSVG />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          options={{}}
          className={cn(dark ? 'dark' : 'light', 'mt-4 w-80 bg-gray-1 border border-gray-4')}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormLabel className="text-gray-12">Quick Range</FormLabel>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quickRange"
                render={({ field }) => (
                  <>
                    {quickRanges.flatMap(({ unit, value }, quickRangeIndex) =>
                      value.map((range, valueIndex) => (
                        <FormItem className="w-full" key={`${quickRangeIndex}-${valueIndex}`}>
                          <FormControl>
                            <Button
                              type="button"
                              className="w-full"
                              options={{
                                variant: 'outline',
                              }}
                              onClick={() => {
                                form.setValue('fullRange', undefined);
                                field.onChange({ unit, value: range });
                              }}
                            >
                              {formatQuickRange({ range, unit })}
                            </Button>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ))
                    )}
                  </>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-12">Custom Date Range</FormLabel>
                  <div className="flex flex-col">
                    <Calendar
                      mode="range"
                      className="bg-gray-6"
                      selected={field.value as DateRange}
                      onSelect={(date) => {
                        form.setValue('quickRange', undefined);
                        field.onChange(date);
                      }}
                      disabled={(date) =>
                        // future dates up to 1 year only
                        date < new Date() || date > add(new Date(), { years: 1 })
                      }
                      initialFocus
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full flex-row justify-between">
              <Button
                type="button"
                options={{ intent: 'destructive', variant: 'solid' }}
                onClick={() => setCalIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </Form>
  );
};

const ClockSVG = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fal"
    data-icon="clock"
    className="overflow-visible box-content w-3 h-[1em] ml-[0.5em] items-center align-middle"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M240 112C240 103.2 247.2 96 256 96C264.8 96 272 103.2 272 112V247.4L360.9 306.7C368.2 311.6 370.2 321.5 365.3 328.9C360.4 336.2 350.5 338.2 343.1 333.3L247.1 269.3C242.7 266.3 239.1 261.3 239.1 256L240 112zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM32 256C32 379.7 132.3 480 256 480C379.7 480 480 379.7 480 256C480 132.3 379.7 32 256 32C132.3 32 32 132.3 32 256z"
    ></path>
  </svg>
);

const DownSVG = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fal"
    data-icon="chevron-down"
    className="overflow-visible box-content w-3 h-[1em] ml-[0.5em] items-center align-middle"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M4.251 181.1C7.392 177.7 11.69 175.1 16 175.1c3.891 0 7.781 1.406 10.86 4.25l197.1 181.1l197.1-181.1c6.5-6 16.64-5.625 22.61 .9062c6 6.5 5.594 16.59-.8906 22.59l-208 192c-6.156 5.688-15.56 5.688-21.72 0l-208-192C-1.343 197.7-1.749 187.6 4.251 181.1z"
    ></path>
  </svg>
);
