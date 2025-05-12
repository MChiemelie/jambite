'use client';

import useSWR from 'swr';
import { getQuestions } from '@/services';
import { useSelectedSubjectsParameters } from '@/stores/practice';
import { randomYear } from '@/utilities';
import { useMemo } from 'react';

export function useQuestions(fetchData: boolean) {
  const subjects = useSelectedSubjectsParameters();
  const year = useMemo(() => randomYear(), []);

  const key = subjects && year ? [`/api/questions/${subjects}/${year}`, subjects, year] : null;

  const fetcher = () => getQuestions(subjects!, year!);

  const { data, error, isLoading } = useSWR(fetchData ? key : null, fetcher);

  return {
    questions: data,
    questionsLoading: isLoading,
    questionsError: error,
  };
}
