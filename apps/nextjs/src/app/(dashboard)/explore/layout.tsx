import { TopToolBar } from '~/app/(dashboard)/_components/top-tool-bar';
import {
  DocsButton,
  QueryHistoryButton,
  StarredQuerriesButton,
} from '~/app/(dashboard)/_components/top-toolbar-buttons';
import { Separator } from '@haxiom/ui/separator';
import { FieldListButton } from '~/app/(dashboard)/explore/_components/top-toolbar-buttons';

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopToolBar className="justify-between gap-2">
        <h1 className="font-bold text-lg">Data Explorer</h1>
        <div className="flex h-full items-center gap-2">
          <DocsButton />
          <Separator className="mx-2" orientation="vertical" />
          <StarredQuerriesButton />
          <QueryHistoryButton />
          <Separator className="mx-2" orientation="vertical" />
          <FieldListButton />
        </div>
      </TopToolBar>
      {children}
    </>
  );
}
