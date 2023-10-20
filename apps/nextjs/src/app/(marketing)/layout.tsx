import { Axiom } from '@haxiom/ui/icons';
import { cn } from '@haxiom/ui';
import { MAIN_CONTENT_CLASS, MAX_WIDTH_CLASS } from '~/app/(dashboard)/_constants';
import Link from 'next/link';
import { Button } from '@haxiom/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <NavigationBar /> */}
      <main className={cn(MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS)}>{children}</main>
    </>
  );
}

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 bg border-b">
      <div className={cn('flex justify-between h-12', MAX_WIDTH_CLASS)}>
        <div className="flex items-center h-full">
          <Link
            href={'/'}
            className="hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 h-full px-4 block flex items-center"
          >
            <Axiom className="h-6 w-6" />
          </Link>
          <Link
            href={'/igor'}
            className="hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 h-full px-4 block flex items-center"
          >
            Igor's UI Components
          </Link>
          <Link
            href={'/ov'}
            className="hover:bg-element-hover focus:bg-element-hover focus-visible:ring-offset-0 h-full px-4 block flex items-center"
          >
            Ollie Explorations
          </Link>
        </div>
        <div className="flex items-center h-full">
          <Button asChild>
            <Link href={'/datasets'}>Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
