'use client';

import { useEffect, useMemo, useState } from 'react';
import { getUserData } from '@/services';
import { useSelectedSubjectsParameters } from '@/stores/practice';
import { Question } from '@/types';
import { randomYear } from '@/utilities';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

type QuestionsData = Record<string, Question[]>;

interface ProgressState {
  questions: QuestionsData | null;
  progress: number;
  currentSubject: string;
  isLoading: boolean;
  error: Error | null;
}

export function useQuestionsWithProgress(fetchData: boolean) {
  const router = useRouter();
  const subjects = useSelectedSubjectsParameters();
  const year = useMemo(() => randomYear(), []);

  const [state, setState] = useState<ProgressState>({
    questions: null,
    progress: 0,
    currentSubject: '',
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    console.log('🔍 useQuestionsWithProgress - fetchData:', fetchData);
    console.log('🔍 useQuestionsWithProgress - subjects:', subjects);

    if (!fetchData || !subjects || subjects.length === 0) {
      console.log('⏸️ Skipping fetch - conditions not met');
      return;
    }

    console.log('✅ Starting fetch process...');
    let isCancelled = false;

    const fetchQuestions = async () => {
      try {
        // Check trials first
        const { trials } = await getUserData();
        if (trials === 0) {
          router.push('/payments');
          return;
        }

        if (isCancelled) return;

        setState({
          questions: null,
          progress: 0,
          currentSubject: 'Use of English',
          isLoading: true,
          error: null,
        });

        const totalSteps = subjects.length + 1; // +1 for English
        const questionsBySubject: QuestionsData = {};
        let completedSteps = 0;

        // Step 1: Fetch English (Use of English)
        if (isCancelled) return;

        const englishRes = await fetch(`${BASE_URL}/api/questions/english?year=${year}&count=60`);
        if (!englishRes.ok) {
          throw new Error(`Failed to fetch English questions: ${englishRes.statusText}`);
        }
        const englishData = await englishRes.json();

        if (!englishData.questions || englishData.questions.length === 0) {
          throw new Error('No English questions returned from API');
        }

        questionsBySubject['Use of English'] = englishData.questions;
        completedSteps++;

        if (isCancelled) return;

        const englishProgress = Math.round((completedSteps / totalSteps) * 100);
        console.log('English loaded, progress:', englishProgress, `(${completedSteps}/${totalSteps})`);

        setState({
          questions: { ...questionsBySubject },
          progress: englishProgress,
          currentSubject: subjects[0] || 'Loading subjects...',
          isLoading: true,
          error: null,
        });

        // Step 2: Fetch each subject sequentially
        for (let i = 0; i < subjects.length; i++) {
          if (isCancelled) return;

          const subject = subjects[i];
          console.log(`Fetching subject ${i + 1}/${subjects.length}:`, subject);

          setState((prev) => ({
            ...prev,
            currentSubject: subject,
          }));

          const subjectRes = await fetch(`${BASE_URL}/api/questions/subject?name=${subject}&count=40`);
          if (!subjectRes.ok) {
            console.error(`Failed to fetch ${subject}, continuing with others...`);
            continue; // Don't throw, just skip this subject
          }

          const subjectData = await subjectRes.json();
          questionsBySubject[subjectData.subject] = subjectData.questions;
          completedSteps++;

          if (isCancelled) return;

          const subjectProgress = Math.round((completedSteps / totalSteps) * 100);
          console.log(`${subjectData.subject} loaded, progress:`, subjectProgress, `(${completedSteps}/${totalSteps})`);

          setState({
            questions: { ...questionsBySubject },
            progress: subjectProgress,
            currentSubject: i + 1 < subjects.length ? subjects[i + 1] : 'Complete',
            isLoading: true,
            error: null,
          });
        }

        // All done!
        if (isCancelled) return;
        setState({
          questions: questionsBySubject,
          progress: 100,
          currentSubject: 'Complete',
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (isCancelled) return;
        console.error('Error fetching questions with progress:', err);
        setState({
          questions: null,
          progress: 0,
          currentSubject: '',
          isLoading: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        });
      }
    };

    fetchQuestions();

    return () => {
      isCancelled = true;
    };
  }, [fetchData, subjects, year, router]);

  console.log('📤 Hook returning - progress:', state.progress, 'isLoading:', state.isLoading, 'currentSubject:', state.currentSubject);

  return {
    questions: state.questions,
    questionsLoading: state.isLoading,
    questionsError: state.error,
    progress: state.progress,
    currentSubject: state.currentSubject,
  };
}