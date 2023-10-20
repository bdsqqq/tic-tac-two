'use client';

import { Axiom, ChevronDown, Settings } from '@haxiom/ui/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserDropdown } from './user-dropdown';
import { cn } from '@haxiom/ui';
import { MOCK_CURRENT_ORG, OrgDropdown } from '~/app/(dashboard)/_components/organization-dropdown';
import { DropdownMenuTrigger } from '@haxiom/ui/dropdown-menu';
import { MAX_WIDTH_CLASS } from '~/app/(dashboard)/_constants';
import { Separator } from '@haxiom/ui/separator';
import type { Route } from 'next';

const NAV_ITEMS = [
  {
    label: 'Datasets',
    href: '/datasets',
  },
  {
    label: 'Stream',
    href: '/stream',
  },
  {
    label: 'Explore',
    href: '/explore',
  },
  {
    label: 'Dashboards',
    href: '/dashboards',
  },
  {
    label: 'Monitors',
    href: '/monitors',
  },
] satisfies { href: Route; label: string }[];

export const NavigationBar = () => {
  const pathname = usePathname();

  /**
   * Assuming the first path segment is the top-level path
   * in Axiom proper, this would be false as the first path
   * segment is orgId.
   */
  const topLevelPath = pathname.split('/')[1];

  return (
    <nav className="sticky top-0 bg border-b border-subtle h-12 z-20">
      <div className={cn('flex justify-between h-full', MAX_WIDTH_CLASS)}>
        <div className="flex items-center h-full">
          <Link
            href={'/'}
            className="hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 h-full px-4 flex items-center"
          >
            <Axiom className="h-6 w-6" />
          </Link>

          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              className={cn(
                'hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 h-full px-4 flex items-center border-b -mb-px',
                topLevelPath === href.split('/')[1] ? 'border-b-gray-11' : 'border-transparent'
              )}
              href={href}
            >
              {label}
            </Link>
          ))}

          <Separator orientation="vertical" />

          <Link
            href={'/settings'}
            className={cn(
              'hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 h-full px-4 flex items-center border-b',
              topLevelPath === 'settings' ? 'border-b-gray-11' : 'border-transparent'
            )}
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex items-center h-full">
          <Separator orientation="vertical" />
          <OrgDropdown>
            <DropdownMenuTrigger className="flex gap-1 hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 data-[state=open]:bg-element-hover h-full px-4 items-center">
              {MOCK_CURRENT_ORG?.name} <ChevronDown className="h-4 w-4 mt-1" />
            </DropdownMenuTrigger>
          </OrgDropdown>
          <UserDropdown className="hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 data-[state=open]:bg-element-hover h-full px-1" />
        </div>
      </div>
    </nav>
  );
};
