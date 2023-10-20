import { Button } from '@haxiom/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@haxiom/ui/tooltip';

interface SaveProps {
  className?: string;
}

export const Save = ({ className }: SaveProps) => {
  // debug stupid tooltip
  // setTimeout(() => { debugger; }, 1000);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>💾</Button>
        </TooltipTrigger>
        <TooltipContent className={className} options={{ size: 'sm' }} side="top" align="center" sideOffset={4}>
          <p className="text-gray-1">Save but if you have a lot of text, should choose a different size, no?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
