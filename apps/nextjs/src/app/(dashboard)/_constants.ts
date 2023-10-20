export const MAX_WIDTH_CLASS = 'max-w-6xl mx-auto px-4 md:px-8';
export const MAIN_CONTENT_CLASS = 'py-4';
export const BORDER_DECORATIVE_CLASS = 'border-dashed border-gray-3';

export const MOCK_DATASETS = [
  {
    name: '_traces',
    description: 'All traces',
    size: {
      value: '8',
      unit: 'kb',
    },
    entries: 29382,
    id: 'traces-auhe',
    fields: [
      {
        name: 'traceId',
        type: 'string',
      },
      {
        name: '_duration',
        type: 'number',
      },
      {
        name: 'kind',
        type: 'string',
      },
      {
        name: 'scope',
        type: 'string',
      },
    ],
  },
  {
    name: 'vercel',
    description: 'Vercel website data',
    size: {
      value: '27',
      unit: 'mb',
    },
    entries: 78456,
    id: 'vercel-ds9f',
    fields: [
      {
        name: 'pageId',
        type: 'string',
      },
      {
        name: 'loadTime',
        type: 'number',
      },
      {
        name: 'country',
        type: 'string',
      },
      {
        name: 'deviceType',
        type: 'string',
      },
    ],
  },
  {
    name: 'cloudflare',
    description: 'Cloudflare analytics',
    size: {
      value: '105',
      unit: 'gb',
    },
    entries: 2157312,
    id: 'cloudflare-xy74',
    fields: [
      {
        name: 'requestId',
        type: 'string',
      },
      {
        name: 'responseTime',
        type: 'number',
      },
      {
        name: 'country',
        type: 'string',
      },
      {
        name: 'statusCode',
        type: 'number',
      },
    ],
  },
];
