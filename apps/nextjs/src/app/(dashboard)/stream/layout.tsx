import { TopToolBar } from '~/app/(dashboard)/_components/top-tool-bar';
import { SelectDataset } from '~/app/(dashboard)/_components/select-dataset';
import { DocsButton, StarredQuerriesButton } from '~/app/(dashboard)/_components/top-toolbar-buttons';
import { Separator } from '@haxiom/ui/separator';
import { FilterBuilder } from '~/app/(dashboard)/stream/_components.tsx/filter-builder';
import { QuickRangeButton, ToggleRealtimeButton } from './_components.tsx/top-toolbar-buttons';

export default function StreamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopToolBar className="justify-between gap-2">
        <div className="flex h-full items-center">
          <SelectDataset />
        </div>
        <div className="flex w-full">
          <FilterBuilder />
        </div>
        <div className="flex h-full items-center gap-2">
          <DocsButton />
          <Separator className="mx-2" orientation="vertical" />
          <StarredQuerriesButton />
          <QuickRangeButton />
          <ToggleRealtimeButton />
        </div>
      </TopToolBar>
      {children}
    </>
  );
}
