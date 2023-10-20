import { cn } from '@haxiom/ui';
import { MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS } from '~/app/(dashboard)/_constants';
import { DatasetsTable } from '~/app/(dashboard)/_components/datasets-table';
import { StarredQueriesCard } from '~/app/(dashboard)/_components/starred-queries-card';

export default function Page() {
  return (
    <main className={cn(MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS)}>
      <div className="grid gap-4 grid-cols-12">
        <div className="col-span-8 row-start-1 row-end-[4]">
          <DatasetsTable />
        </div>
        <div className="col-span-4 col-end-13 row-span-1">
          <StarredQueriesCard />
        </div>
      </div>
    </main>
  );
}
