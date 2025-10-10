'use client';

import { getUserData } from '@/services';
import useSWR from 'swr';

export function useUser() {
  const {
    error,
    isLoading,
    data: user,
    mutate,
  } = useSWR('/api/user', getUserData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    user,
    isLoading,
    isError: !!error,
    mutate,
  };
}
