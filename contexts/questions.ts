'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { getQuestions } from '@/services';
import { useSelectedSubjectsParameters } from '@/stores/practice';
import type { Question } from '@/types';
import { randomYear } from '@/utilities';

export function useQuestions(fetchData: boolean) {
  const subjects = useSelectedSubjectsParameters();
  const year = useMemo(() => randomYear(), []);
  const [progress, setProgress] = useState(0);

  const key = subjects && year ? ['questions', subjects.join(','), year] : null;

  const fetcher = () => {
    setProgress(5); // Start
    return getQuestions(subjects!, year!, (progressValue) => {
      // Update progress as data is being downloaded
      setProgress(progressValue);
    });
  };

  const { data, error, isLoading } = useSWR<Record<string, Question[]>>(fetchData ? key : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess: () => {
      setProgress(100); // Ensure it's at 100% when complete
      setTimeout(() => setProgress(0), 500); // Reset after a brief delay
    },
    onError: () => {
      setProgress(0); // Reset on error
    }
  });

  return {
    questions: data,
    questionsLoading: isLoading,
    questionsError: error,
    progress: isLoading ? progress : 0 // Only show progress while loading
  };
}
