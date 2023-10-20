import { useState } from 'react';

import { cn } from '@haxiom/ui';
import { Button } from '@haxiom/ui/button';
import { Popover, PopoverContent2, PopoverTrigger } from '@haxiom/ui/popover';

export const Edit = ({ dark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2" options={{ size: 'sm', variant: 'outline' }}>
          Edit
        </Button>
      </PopoverTrigger>
      {/* alternative is to declare radix stuff here and not as a part of the options */}
      <PopoverContent2 options={{ size: 'full' }} side="top" align="start">
        <FakeMenu className={dark ? 'dark' : 'light'} />
      </PopoverContent2>
    </Popover>
  );
};

interface FakeMenuProps {
  className: string | undefined;
}

const FakeMenu = ({ className, ...props }: FakeMenuProps) => {
  return (
    <div className={cn(className, 'flex items-center p-1')} {...props}>
      <Button options={{ variant: 'outline' }}>
        {/* should we add fill to button? */}
        <PencilSVG />
      </Button>

      <Button options={{ variant: 'outline' }}>
        <LayerSVG />
      </Button>

      <Button options={{ variant: 'outline' }}>
        <TrashSVG />
      </Button>
    </div>
  );
};

const PencilSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-12">
    <path
      d="M13.6691 6.94923L7.29591 13.6872C7.10702 13.8869 6.84428 14 6.56941 14L3.66668 14C3.11439 14 2.66668 13.5523 2.66668 13L2.66668 10.0717C2.66668 9.81193 2.76774 9.56238 2.94848 9.37583L9.38784 2.72966C9.77214 2.33301 10.4052 2.323 10.8019 2.70731C10.8057 2.71097 10.8094 2.71467 10.8131 2.71839L13.6497 5.55496C14.0326 5.93782 14.0412 6.55587 13.6691 6.94923Z"
      fill="currentColor"
    ></path>
  </svg>
);

const LayerSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-12">
    <path
      opacity="0.3"
      d="M10.6638 3.99996H6.00002C4.89545 3.99996 4.00002 4.89539 4.00002 5.99996V10.6637C3.13459 10.6211 2.66669 10.1137 2.66669 9.21208V4.12117C2.66669 3.1783 3.17836 2.66663 4.12123 2.66663H9.21214C10.1138 2.66663 10.6211 3.13453 10.6638 3.99996Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.78786 5.33337H11.8788C12.8216 5.33337 13.3333 5.84505 13.3333 6.78792V11.8788C13.3333 12.8217 12.8216 13.3334 11.8788 13.3334H6.78786C5.84499 13.3334 5.33331 12.8217 5.33331 11.8788V6.78792C5.33331 5.84505 5.84499 5.33337 6.78786 5.33337Z"
      fill="currentColor"
    ></path>
  </svg>
);

const TrashSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-12">
    <path
      d="M4 5.33337H12L11.4044 13.0767C11.3643 13.5977 10.9298 14 10.4073 14H5.5927C5.07016 14 4.63572 13.5977 4.59564 13.0767L4 5.33337ZM5.33333 6.66671L5.63625 9.393L10.3679 9.35598L10.6667 6.66671H5.33333Z"
      fill="currentColor"
    ></path>
    <path
      opacity="0.3"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.33331 3V2.33333C9.33331 2.14924 9.18407 2 8.99998 2H6.99998C6.81588 2 6.66665 2.14924 6.66665 2.33333V3H3.66665C3.48255 3 3.33331 3.14924 3.33331 3.33333V3.66667C3.33331 3.85076 3.48255 4 3.66665 4H12.3333C12.5174 4 12.6666 3.85076 12.6666 3.66667V3.33333C12.6666 3.14924 12.5174 3 12.3333 3H9.33331Z"
      fill="currentColor"
    ></path>
  </svg>
);
