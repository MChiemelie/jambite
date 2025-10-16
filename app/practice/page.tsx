'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Status } from '@/components/custom';
import { Awaiting, Practice } from '@/components/practice';
import { useQuestions, useUser } from '@/contexts';
import { decrementTrials } from '@/services/payments';
import { useFetchData, usePracticeActions, useSelectedSubjectsParameters } from '@/stores/practice';

export default function PracticePage() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const selectedSubjectsParameters = useSelectedSubjectsParameters();
  const fetchData = useFetchData();

  const { setUser, setQuestions, setFetchData } = usePracticeActions();

  const { user, isLoading: userLoading, isError: userError } = useUser();
  const { questions, questionsLoading, questionsError, progress } = useQuestions(fetchData);

  const [started, setStarted] = useState(false);

  // Check if questions object has actual data
  const hasQuestions = questions && Object.keys(questions).length > 0 && Object.values(questions).some((arr) => Array.isArray(arr) && arr.length > 0);

  // Questions are ready when loaded and have data
  const questionsReady = !questionsLoading && hasQuestions;

  const startPractice = useCallback(() => {
    if (hasStarted.current) return;
    if (!questionsReady) return; // Don't start if not ready

    hasStarted.current = true;

    decrementTrials();
    if (user) setUser(user);
    if (questions) setQuestions(questions);

    setStarted(true);
  }, [questionsReady, user, questions, setUser, setQuestions]);

  useEffect(() => {
    if (selectedSubjectsParameters.length !== 3) {
      router.push('/dashboard');
    }
  }, [selectedSubjectsParameters, router]);

  useEffect(() => {
    if (!fetchData) {
      setFetchData(true);
    }
  }, [fetchData, setFetchData]);

  if (userLoading || questionsLoading) {
    return (
      <Awaiting
        ready={questionsReady}
        progress={progress}
        estimatedSeconds={180}
        onCancel={() => router.push('/dashboard')}
        onClose={startPractice}
        onTimeEnd={() => {
          // Auto-start only if questions are ready
          if (questionsReady) {
            startPractice();
          }
        }}
      />
    );
  }

  if (userError || questionsError) {
    return (
      <>
        {userError && <Status image='/assets/error.svg' desc1={`User Error: ${String(userError)}`} desc2="Couldn't fetch your profile." />}
        {questionsError && <Status image='/assets/error.svg' desc1={`Questions Error: ${String(questionsError?.message ?? questionsError)}`} desc2="Couldn't load your questions." />}
      </>
    );
  }

  if (!started || !questionsReady) {
    return (
      <Awaiting
        ready={questionsReady}
        progress={progress}
        estimatedSeconds={180}
        onCancel={() => router.push('/dashboard')}
        onClose={startPractice}
        onTimeEnd={() => {
          if (questionsReady) {
            startPractice();
          }
        }}
      />
    );
  }

  return <Practice />;
}
