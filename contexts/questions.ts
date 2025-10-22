'use client';

import { useCallback, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { getQuestions } from '@/services';
import {
  useFetchProgress,
  usePracticeActions,
  useSelectedSubjectsParameters
} from '@/stores/practice';
import type { Question } from '@/types';
import { randomYear } from '@/utilities';

export function useQuestions(fetchData: boolean) {
  const subjects = useSelectedSubjectsParameters();
  const year = useMemo(() => randomYear(), []);
  const storedProgress = useFetchProgress();
  const { setFetchProgress } = usePracticeActions();
  const progressRef = useRef(storedProgress);

  const key = subjects && year ? ['questions', subjects.join(','), year] : null;

  const handleProgress = useCallback(
    (progressValue: number) => {
      if (progressValue > progressRef.current) {
        progressRef.current = progressValue;
        setFetchProgress(progressValue);
      }
    },
    [setFetchProgress]
  );

  const fetcher = useCallback(async () => {
    if (storedProgress === 0) {
      progressRef.current = 0;
      setFetchProgress(5);
    }

    const data = await getQuestions(subjects!, year!, handleProgress);
    return data;
  }, [subjects, year, handleProgress, storedProgress, setFetchProgress]);

  const { data, error, isLoading } = useSWR<Record<string, Question[]>>(
    fetchData ? key : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
      onSuccess: (_fetchedData) => {
        setFetchProgress(100);
        setTimeout(() => {
          setFetchProgress(0);
          progressRef.current = 0;
        }, 500);
      },
      onError: (err) => {
        console.error('❌ Questions loading error:', err);
        setFetchProgress(0);
        progressRef.current = 0;
      },
      errorRetryInterval: 5000,
      errorRetryCount: 2,
      keepPreviousData: true
    }
  );

  return {
    questions: data,
    questionsLoading: isLoading,
    questionsError: error,
    progress: isLoading ? storedProgress : 0
  };
}
