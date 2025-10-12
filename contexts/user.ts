'use client';

import useSWR from 'swr';
import { getUserData } from '@/services';

export function useUser() {
  const {
    error,
    isLoading,
    data: user,
    mutate
  } = useSWR('/api/user', getUserData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  });

  return {
    user,
    isLoading,
    isError: !!error,
    mutate
  };
}
