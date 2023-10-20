import { cn } from '@haxiom/ui';
import { MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS } from '~/app/(dashboard)/_constants';
import { DatasetsTable } from '~/app/(dashboard)/_components/datasets-table';
import { QueryHistoryCard } from '~/app/(dashboard)/_components/query-history-card';
import { AplEditorMock } from '~/app/(dashboard)/explore/_components/apl-editor-mock';

export default function Page() {
  return (
    <main className={cn(MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS)}>
      <div className="grid gap-4 grid-cols-12">
        <div className="col-span-full">
          <AplEditorMock />
        </div>
        <div className="col-span-8">
          <DatasetsTable />
        </div>
        <div className="col-span-4 col-end-13">
          <QueryHistoryCard />
        </div>
      </div>
    </main>
  );
}
