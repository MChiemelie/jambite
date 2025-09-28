'use client';

import { getUserData } from '@/services';
import { User } from '@/types';
import useSWR from 'swr';

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<User>('/api/user', getUserData);

  return {
    user: data ?? null,
    userLoading: isLoading,
    userError: error,
    refreshUser: () => mutate(),
  };
}
