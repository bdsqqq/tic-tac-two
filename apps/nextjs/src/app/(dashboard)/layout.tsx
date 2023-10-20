import { Debugger } from './_components/debugger';
import { NavigationBar } from './_components/navigation-bar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationBar />
      {children}
      <Debugger />
    </>
  );
}
