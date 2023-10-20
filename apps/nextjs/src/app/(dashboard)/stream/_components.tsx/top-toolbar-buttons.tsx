'use client';

import { cn } from '@haxiom/ui';
import { Button } from '@haxiom/ui/button';
import { Clock, Pause, Play } from '@haxiom/ui/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@haxiom/ui/popover';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface QuickRange {
  value: number;
  unit: 'm' | 'h' | 'd';
}
const QUICK_RANGES: QuickRange[] = [
  {
    value: 5,
    unit: 'm',
  },
  {
    value: 15,
    unit: 'm',
  },
  {
    value: 30,
    unit: 'm',
  },
  {
    value: 1,
    unit: 'h',
  },
  {
    value: 3,
    unit: 'h',
  },
  {
    value: 6,
    unit: 'h',
  },
  {
    value: 15,
    unit: 'h',
  },
  {
    value: 30,
    unit: 'd',
  },
  {
    value: 90,
    unit: 'd',
  },
];

const COMPUTE_QUICK_RANGE_LABEL = (quickRange: QuickRange) => {
  if (quickRange.unit === 'm') {
    return `${quickRange.value} minute${quickRange.value > 1 ? 's' : ''}`;
  }

  if (quickRange.unit === 'h') {
    return `${quickRange.value} hour${quickRange.value > 1 ? 's' : ''}`;
  }

  if (quickRange.unit === 'd') {
    return `${quickRange.value} day${quickRange.value > 1 ? 's' : ''}`;
  }

  return '';
};

const COMPUTE_QUICK_RANGE_MAP_KEY = (quickRange: QuickRange) => {
  return `${quickRange.value}${quickRange.unit}`;
};

const QUICK_RANGE_LABELS = new Map(
  QUICK_RANGES.map((quickRange) => [COMPUTE_QUICK_RANGE_MAP_KEY(quickRange), COMPUTE_QUICK_RANGE_LABEL(quickRange)])
);

export const QuickRangeButton = () => {
  const pathname = usePathname();

  const urlSegments = pathname.split('/');
  const datasetIdFromUrl = urlSegments[urlSegments.indexOf('stream') + 1];

  const [selectedQuickRange, setSelectedQuickRange] = useState<QuickRange | null>(null);

  const handleQuickRangeClick = (quickRange: QuickRange) => {
    setSelectedQuickRange(quickRange);
  };

  return (
    <Popover>
      <PopoverTrigger className="data-[state=open]:bg-subtle" asChild>
        <Button
          options={{
            variant: 'outline',
            size: 'icon',
          }}
          className={cn('w-max min-w-[121px] justify-between p-2 gap-2', !datasetIdFromUrl ? 'hidden' : '')}
        >
          <Clock className="shrink-0 h-4 w-4" />
          {selectedQuickRange ? (
            <span className="whitespace-nowrap">
              {QUICK_RANGE_LABELS.get(COMPUTE_QUICK_RANGE_MAP_KEY(selectedQuickRange))}
            </span>
          ) : (
            <span className="whitespace-nowrap text-subtle">Quick Range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="grid grid-cols-3 gap-2">
        {QUICK_RANGES.map((quickRange) => (
          <Button
            key={COMPUTE_QUICK_RANGE_MAP_KEY(quickRange)}
            onClick={() => handleQuickRangeClick(quickRange)}
            options={{
              variant: quickRange === selectedQuickRange ? 'solid' : 'outline',
            }}
          >
            {COMPUTE_QUICK_RANGE_LABEL(quickRange)}
          </Button>
        ))}
        <Button
          onClick={() => setSelectedQuickRange(null)}
          options={{
            variant: !selectedQuickRange ? 'solid' : 'outline',
          }}
          className="col-span-3"
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export const ToggleRealtimeButton = () => {
  const pathname = usePathname();

  const urlSegments = pathname.split('/');
  const datasetIdFromUrl = urlSegments[urlSegments.indexOf('stream') + 1];

  const [isRealtime, setIsRealtime] = useState(false);
  const toggleRealtime = () => setIsRealtime((prev) => !prev);

  return (
    <Button
      onClick={toggleRealtime}
      options={{
        variant: isRealtime ? 'solid' : 'outline',
        size: 'icon',
      }}
      className={cn(!datasetIdFromUrl ? 'hidden' : '')}
    >
      {isRealtime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  );
};
