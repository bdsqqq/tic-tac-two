'use client';
import * as React from 'react';

import { Edit } from './_components/Edit';
import { TimeRange } from './_components/TimeRange';
import { Save } from './_components/Save';

export const runtime = 'edge';

export default function Home() {
  return (
    <section className="min-h-screen w-full">
      <div className="m-auto flex h-full w-fit flex-col items-center justify-center gap-4">
        <div className="flex h-full w-full flex-row items-center justify-center gap-4">
          {/* issue with light and dark support, what about absolutely positioned el's that don't have a parent w light or dark? */}
          <div className="dark p-12 bg-gray-1">
            <TimeRange dark />
          </div>

          <div className="light p-12 bg-gray-1">
            <TimeRange />
          </div>
        </div>

        <div className="flex h-full w-full flex-row items-center justify-center gap-4">
          <div className="dark p-12 w-full bg-gray-1">
            <Edit dark />
          </div>

          <div className="light p-12 w-full bg-gray-1">
            <Edit />
          </div>
        </div>

        <div className="flex h-full w-full flex-row items-center justify-center gap-4">
          <div className="dark p-12 w-full bg-gray-1">
            <Save className="dark" />
          </div>

          <div className="light p-12 w-full bg-gray-1">
            <Save className="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
