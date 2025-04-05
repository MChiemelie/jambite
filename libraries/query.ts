'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { DefaultOptions, QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3600000,
      cacheTime: 86400000,
      retry: 1,
    } as DefaultOptions['queries'],
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 86400000,
});

export { queryClient };
