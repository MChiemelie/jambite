'use client';

import { getUserData } from '@/services';
import { SWRConfig } from 'swr';

export default function UserProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ fetcher: getUserData }}>{children}</SWRConfig>;
}
