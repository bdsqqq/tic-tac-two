import { Card, CardContent, CardHeader, CardTitle } from '@haxiom/ui/card';
import { Logo, Plug } from '@haxiom/ui/icons';
import Link from 'next/link';

const MAX_INTEGRATION_DASHBOARDS = 5;
// TODO: make MOCK_INTEGRATION_DASHBOARDS
const INTEGRATION_DASHBOARDS: string[] = ['', ''];
const INTEGRATION_DASHBOARDS_TO_RENDER = INTEGRATION_DASHBOARDS.slice(0, MAX_INTEGRATION_DASHBOARDS);

export const IntegrationDashboardsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Plug className="h-4 w-4" /> Integration Dashboards
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-0 -mb-px">
        {INTEGRATION_DASHBOARDS_TO_RENDER.length ? (
          INTEGRATION_DASHBOARDS_TO_RENDER.map((integrationDashboard) => (
            <IntegrationDashboard key={integrationDashboard} />
          ))
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <p>no queries in history</p>
    </div>
  );
};

// TODO: Update with actual content once MOCK_INTEGRATION_DASHBOARDS is done
const IntegrationDashboard = () => {
  return (
    <Link
      className="w-full flex justify-between h-full p-4 hover:bg-element-hover focus:bg-element-hover focus:ring-offset-0 border-b"
      href={''}
    >
      <div className="flex gap-2">
        <Logo className="mt-1 h-6 w-6 shrink-0" />
        <div>
          <h4 className="leading-0">Title title</h4>

          <p className="text-subtle">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, labore?</p>
        </div>
      </div>
    </Link>
  );
};
