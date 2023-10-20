import { TopToolBar } from '~/app/(dashboard)/_components/top-tool-bar';
import { DocsButton } from '~/app/(dashboard)/_components/top-toolbar-buttons';
import { Separator } from '@haxiom/ui/separator';
import { ManageNotifiersButton } from '~/app/(dashboard)/monitors/_components/top-toolbar-buttons';

export default function MonitorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopToolBar className="justify-between gap-2">
        <h1 className="font-bold text-lg">All Monitors</h1>
        <div className="flex h-full items-center gap-2">
          <DocsButton />
          <Separator className="mx-2" orientation="vertical" />
          <ManageNotifiersButton />
        </div>
      </TopToolBar>
      {children}
    </>
  );
}
