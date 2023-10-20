'use client';

import { MOCK_DATASETS } from '~/app/(dashboard)/_constants';
import { Button } from '@haxiom/ui/button';
import Link from 'next/link';
import { HardDrive, Layers } from '@haxiom/ui/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@haxiom/ui/card';
import { NewDatasetDialog } from './new-dataset-dialog';
import { Lock } from './Lock';
import { useState } from 'react';
import { useDebugStore } from './debugger';
import { mockAction } from '../_utils';

const DATASET_URL_PREFIX = '/datasets';
const MAKE_DATASET_URL = (id: string) => `${DATASET_URL_PREFIX}/${id}`;

export const DatasetsTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hasABunchOfAccesses } = useDebugStore();

  return (
    <Card>
      <CardHeader className="justify-between relative">
        <CardTitle>Datasets</CardTitle>
        <NewDatasetDialog
          onOpenChange={(e) => {
            setDialogOpen(e);
          }}
          open={dialogOpen}
        >
          <Lock locked={!hasABunchOfAccesses} lockedFeedback={<NoAccessFeedback />}>
            <Button
              onClick={() => setDialogOpen(true)}
              options={{
                variant: 'outline',
              }}
              className="absolute -inset-px left-auto h-auto focus:ring-offset-0 data-[state=open]:bg-element-hover"
            >
              New Dataset
            </Button>
          </Lock>
        </NewDatasetDialog>
      </CardHeader>
      <CardContent className="p-0 -mb-px">
        {MOCK_DATASETS.map((dataset) => (
          <Link
            key={dataset.id}
            className="w-full flex justify-between h-full p-4 hover:bg-element-hover focus:bg-element-hover focus:ring-offset-0 border-b"
            href={MAKE_DATASET_URL(dataset.id)}
          >
            <span>{dataset.name}</span>
            <div className="flex gap-4 font-mono uppercase text-sm">
              <span className="inline-flex items-center gap-1">
                {dataset.size.value}
                {dataset.size.unit} <HardDrive className="w-4 h-4 text-subtle" />
              </span>
              <span className="inline-flex items-center gap-1">
                {dataset.entries} <Layers className="w-4 h-4 text-subtle" />
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

const NoAccessFeedback = () => {
  return (
    <div className="flex flex-col gap-4 max-w-[320px]">
      <div>
        <h4>You're already using your two free datasets.</h4>
        <p className="text-subtle">Unlimited datasets can be created for $25 per month.</p>
      </div>

      <Button
        onClick={() => {
          mockAction('Added a credit card');
        }}
        className="w-max"
      >
        Add a credit card
      </Button>
    </div>
  );
};
