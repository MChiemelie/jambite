'use client';

import useSWR from 'swr';
import { getUserData } from '@/services';

export function useUser(fetchData: boolean) {
  const { data, error, isLoading } = useSWR(fetchData ? '/api/user/' : null, getUserData);

  return {
    user: data,
    userLoading: isLoading,
    userError: error,
  };
}
