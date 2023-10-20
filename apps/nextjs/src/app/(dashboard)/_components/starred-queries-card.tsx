import { Card, CardContent, CardHeader, CardTitle } from '@haxiom/ui/card';
import { Star } from '@haxiom/ui/icons';

export const StarredQueriesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Star className="h-4 w-4" /> Starred queries
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">no starred queries</CardContent>
    </Card>
  );
};
