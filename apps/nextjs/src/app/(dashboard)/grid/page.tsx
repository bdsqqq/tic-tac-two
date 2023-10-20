import { cn } from '@haxiom/ui';
import { MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS } from '~/app/(dashboard)/_constants';
import type { FC, HtmlHTMLAttributes, PropsWithChildren } from 'react';
import { DatasetsTable } from '~/app/(dashboard)/_components/datasets-table';
import { StarredQueriesCard } from '~/app/(dashboard)/_components/starred-queries-card';
import { IntegrationDashboardsCard } from '~/app/(dashboard)/_components/integration-dashboards-card';

export default function Page() {
  return (
    <main className={cn(MAX_WIDTH_CLASS, MAIN_CONTENT_CLASS)}>
      {/* <section>
        <h1>A bunch of items</h1>
        <Grid>
          <div className="col-span-4">
            <TestItem />
          </div>
          <div className="col-span-4">
            <TestItem />
          </div>
          <Grid className="col-span-4">
            <div className="col-span-2">
              <TestItem />
            </div>

            <Grid className="col-span-2">
              <div className="col-span-1">
                <TestItem />
              </div>
              <div className="col-span-1">
                <TestItem />
              </div>
            </Grid>
          </Grid>

          <div className="col-span-7">
            <TestItem />
          </div>

          <Grid className="col-span-2 row-span-3">
            <div className="col-span-2">
              <TestItem />
            </div>
            <div className="col-span-2">
              <TestItem />
            </div>
            <div className="col-span-2">
              <TestItem />
            </div>
          </Grid>

          <div className="col-span-2">
            <TestItem />
          </div>

          <div className="col-span-1">
            <TestItem />
          </div>

          <div className="col-span-2">
            <TestItem />
          </div>

          <div className="col-span-3">
            <TestItem />
          </div>

          <div className="col-span-1">
            <TestItem />
          </div>

          <div className="col-span-1">
            <TestItem />
          </div>
        </Grid>
      </section> */}

      <section className="lg:col-span-12 md:col-span-8 col-span-4">
        <Grid className="lg:grid-rows-2 min-h-[87vh]">
          <div className="col-span-8 lg:row-span-2">
            <DatasetsTable />
          </div>

          <Grid className="lg:col-span-4 md:col-span-8 col-span-4 lg:row-span-2">
            <div className="col-span-4">
              <IntegrationDashboardsCard />
            </div>
            <div className="col-span-4">
              <StarredQueriesCard />
            </div>
          </Grid>
        </Grid>
      </section>
    </main>
  );
}

const Grid: FC<PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>> = ({ children, className, style, ...rest }) => {
  return (
    <div
      style={{
        gridTemplateColumns: 'repeat(var(--columns-available), minmax(0, 1fr))',
        ...style,
      }}
      className={cn('grid [&>*]:px-2 -mx-2 gap-y-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
};

const TestItem = () => <div className="bg-gray-3 border h-full" />;
