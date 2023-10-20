import { TopToolBar } from '~/app/(dashboard)/_components/top-tool-bar';
import { DocsButton } from '~/app/(dashboard)/_components/top-toolbar-buttons';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopToolBar className="justify-between gap-2">
        <h1 className="font-bold text-lg">Settings</h1>
        <div className="flex h-full items-center gap-2">
          <DocsButton />
        </div>
      </TopToolBar>
      {children}
    </>
  );
}
