import { Card, CardContent, CardHeader, CardTitle } from '@haxiom/ui/card';
import { History } from '@haxiom/ui/icons';
import Link from 'next/link';

const MAX_HISTORY = 5;
// TODO: make MOCK_QUERY_HISTORY
const QUERIES: string[] = [];
const QUERIES_TO_RENDER = QUERIES.slice(0, MAX_HISTORY);

export const QueryHistoryCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <History className="h-4 w-4" /> Query history
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-0 -mb-px">
        {QUERIES_TO_RENDER.length ? QUERIES_TO_RENDER.map((query) => <Query key={query} />) : <EmptyState />}
      </CardContent>
    </Card>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <p>no queries in history</p>
    </div>
  );
};

// TODO: Update with actual content once MOCK_QUERY_HISTORY is done
const Query = () => {
  return (
    <Link
      className="w-full flex justify-between h-full p-4 hover:bg-element-hover focus:bg-element-hover focus:ring-offset-0 border-b"
      href={''}
    >
      <span>Hej do</span>
      <div className="flex gap-4 font-mono uppercase text-sm">content</div>
    </Link>
  );
};
