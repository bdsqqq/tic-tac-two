'use client';

import { Button } from '@haxiom/ui/button';
import { Book, History, Star } from '@haxiom/ui/icons';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@haxiom/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@haxiom/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const DEFAULT_DOCS_URL = 'https://axiom.co/docs';
// TODO: currently only top-level routes are supported, should be extended to sub-routes
export const ROUTE_TO_DOCS_URL: Record<string, string> = {
  datasets: 'https://axiom.co/docs/query-data/datasets',
  stream: 'https://axiom.co/docs/query-data/stream',
  explore: 'https://axiom.co/docs/monitor-data/explore',
  dashboards: 'https://axiom.co/docs/query-data/dashboards',
  monitors: 'https://axiom.co/docs/monitor-data/alerts',
  settings: 'https://axiom.co/docs/reference/settings',
  default: DEFAULT_DOCS_URL,
};
export const HIDE_DOCS_BUTTON_IN_ROUTES_MATCHERS = [
  (urlSegments: string[]) => {
    /* sub-route of /stream, aimed at /stream/[datasetId]
     if other sub-routes are added, we should write a
     function that detects if route actually is a
     datasetId. (an ok heuristic is checking if the
     segment ends in a dash followed by 4 characters)
    */
    return urlSegments[urlSegments.indexOf('stream') + 1];
  },
];

const matchRouteToDocsUrl = (route: string) => {
  return ROUTE_TO_DOCS_URL[route] ?? DEFAULT_DOCS_URL;
};

export const DocsButton = () => {
  const pathName = usePathname();
  const topLevelRoute = pathName.split('/')[1];

  const docsUrl = matchRouteToDocsUrl(topLevelRoute ?? 'default');
  const shouldHide = HIDE_DOCS_BUTTON_IN_ROUTES_MATCHERS.some((matcher) => {
    const urlSegments = pathName.split('/');
    return matcher(urlSegments);
  });

  return (
    <Button
      asChild
      options={{
        variant: 'outline',
        size: 'icon',
      }}
      className={shouldHide ? 'hidden' : ''}
    >
      <Link href={docsUrl} target="_blank">
        <Book className="h-4 w-4" />
      </Link>
    </Button>
  );
};

export const StarredQuerriesButton = () => {
  const pathname = usePathname();

  const urlSegments = pathname.split('/');
  const datasetIdFromUrl = urlSegments[urlSegments.indexOf('datasets') + 1];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          options={{
            variant: 'outline',
            size: 'icon',
          }}
        >
          <Star className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Starred Queries</SheetTitle>
        {datasetIdFromUrl ? <>for dataset {datasetIdFromUrl}</> : <>for all datasets</>}
      </SheetContent>
    </Sheet>
  );
};

export const QueryHistoryButton = () => {
  const pathname = usePathname();

  const urlSegments = pathname.split('/');
  const datasetIdFromUrl = urlSegments[urlSegments.indexOf('datasets') + 1];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          options={{
            variant: 'outline',
            size: 'icon',
          }}
        >
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Query History</SheetTitle>
        <Tabs>
          <TabsList>
            <TabsTrigger value="mine">My queries</TabsTrigger>
            <TabsTrigger value="team">Team queries</TabsTrigger>
          </TabsList>
          <TabsContent value="mine">
            <>My queries {datasetIdFromUrl ? <>for dataset {datasetIdFromUrl}</> : <>for all datasets</>}</>
          </TabsContent>
          <TabsContent value="team">
            <>Team queries {datasetIdFromUrl ? <>for dataset {datasetIdFromUrl}</> : <>for all datasets</>}</>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
