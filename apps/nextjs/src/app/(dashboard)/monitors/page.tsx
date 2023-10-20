import { cn } from '@haxiom/ui';
import { MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS } from '~/app/(dashboard)/_constants';
import { AllMonitorsCard } from '~/app/(dashboard)/monitors/_components/all-monitors-card';

export default function Page() {
  return (
    <main className={cn(MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS)}>
      <div className="grid gap-4 grid-cols-12">
        <div className="col-span-full">
          <AllMonitorsCard />
        </div>
      </div>
    </main>
  );
}
