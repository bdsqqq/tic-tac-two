import { cn } from '@haxiom/ui';
import { Button } from '@haxiom/ui/button';
import { Card, CardContent, CardHeader } from '@haxiom/ui/card';
import { SheetTrigger } from '@haxiom/ui/sheet';
import { EditMonitorSheet } from './edit-monitor-sheet';
import { NewMonitorSheet } from '../../_components/new-monitor-sheet';

const MAX_MONITORS = 5;
// TODO: make MOCK_MONITORS
const MONITORS: string[] = ['a', 'b', 'c'];
const MONITORS_TO_RENDER = MONITORS.slice(0, MAX_MONITORS);

export const AllMonitorsCard = () => {
  return (
    <Card>
      <CardHeader className="flex justify-end">
        <NewMonitorSheet>
          <SheetTrigger asChild>
            <Button>New monitor</Button>
          </SheetTrigger>
        </NewMonitorSheet>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-0 -mb-px">
        <EditMonitorSheet>
          {MONITORS_TO_RENDER.length ? (
            MONITORS_TO_RENDER.map((monitor, i) => (
              // TODO: figure out why focus is not going back to the right trigger
              <Monitor light={(i + 1) % 3 === 0 ? 'red' : 'green'} key={monitor} />
            ))
          ) : (
            <EmptyState />
          )}
        </EditMonitorSheet>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <p>No monitors</p>
    </div>
  );
};

// TODO: Update with actual content once MOCK_MONITORS is done
const Monitor = ({ light = 'green', ...rest }: { light?: 'green' | 'red' }) => {
  return (
    <SheetTrigger
      className="text-left w-full flex justify-between h-full p-4 hover:bg-element-hover focus:bg-element-hover focus:ring-offset-0 border-b"
      {...rest}
    >
      <div className="flex justify-between w-full">
        <div className="flex gap-2">
          <div
            className={cn(
              'mt-1.5 rounded-full h-3 w-3 shrink-0 animate-pulse',
              light === 'green' ? 'bg-grass-9' : 'bg-red-9'
            )}
          />
          <div>
            <h4 className="leading-0">Title title</h4>

            <p className="text-subtle">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, labore?</p>
          </div>
        </div>
        <div className="flex items-end">
          <p className="text-sm font-mono"> runs every 5 mins</p>
        </div>
      </div>
    </SheetTrigger>
  );
};
