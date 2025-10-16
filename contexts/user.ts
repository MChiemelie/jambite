'use client';

import useSWR from 'swr';
import { getUserData } from '@/services';
import type { User } from '@/types';

export function useUser() {
  const {
    error,
    isLoading,
    data: user,
    mutate
  } = useSWR<User>('/api/user', getUserData, {
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
