'use client';

import { cn } from '@haxiom/ui';
import { Filter } from '@haxiom/ui/icons';
import { Input } from '@haxiom/ui/input';
import { usePathname } from 'next/navigation';

export const FilterBuilder = () => {
  const pathname = usePathname();

  const urlSegments = pathname.split('/');
  const datasetIdFromUrl = urlSegments[urlSegments.indexOf('stream') + 1];

  return (
    <div className={cn('relative w-full', !datasetIdFromUrl ? 'hidden' : '')}>
      <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-subtle" />
      <Input placeholder="Add a filter..." className={'pl-8 focus:ring-offset-0'} />
    </div>
  );
};
