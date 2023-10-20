import { cn } from '@haxiom/ui';
import { MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS } from '~/app/(dashboard)/_constants';
import { IntegrationDashboardsCard } from '~/app/(dashboard)/_components/integration-dashboards-card';
import { PrivateDashboardsCard } from '~/app/(dashboard)/dashboards/_components/private-dashboards-card';
import { TeamDashboardsCard } from '~/app/(dashboard)/dashboards/_components/team-dashboards-card';

export default function Page() {
  return (
    <main className={cn(MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS)}>
      <div className="grid gap-4 grid-cols-12">
        <div className="col-span-full">
          <IntegrationDashboardsCard />
        </div>
        <div className="col-span-full">
          <PrivateDashboardsCard />
        </div>
        <div className="col-span-full">
          <TeamDashboardsCard />
        </div>
      </div>
    </main>
  );
}
