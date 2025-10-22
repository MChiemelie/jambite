'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Status } from '@/components/custom';
import { Awaiting, Practice } from '@/components/practice';
import { useQuestions, useUser } from '@/contexts';
import { decrementTrials } from '@/services/payments';
import {
  useFetchData,
  usePracticeActions,
  useSelectedSubjectsParameters,
  useQuestions as useStoredQuestions
} from '@/stores/practice';

export default function PracticePage() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const hasDecrementedTrials = useRef(false);
  const selectedSubjectsParameters = useSelectedSubjectsParameters();
  const fetchData = useFetchData();
  const storedQuestions = useStoredQuestions();

  const { setUser, setQuestions, setFetchData } = usePracticeActions();

  const { user, isLoading: userLoading, isError: userError } = useUser();
  const { questions, questionsLoading, questionsError, progress } =
    useQuestions(fetchData);

  const [started, setStarted] = useState(false);

  const hasStoredQuestions =
    storedQuestions &&
    Object.keys(storedQuestions).length > 0 &&
    Object.values(storedQuestions).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
  const hasFetchedQuestions =
    questions &&
    Object.keys(questions).length > 0 &&
    Object.values(questions).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
  const hasQuestions = hasStoredQuestions || hasFetchedQuestions;

  const questionsReady = !questionsLoading && hasQuestions;

  const startPractice = useCallback(async () => {
    if (hasStarted.current) return;
    if (!questionsReady) return;

    hasStarted.current = true;

    if (!hasDecrementedTrials.current) {
      await decrementTrials();
      hasDecrementedTrials.current = true;
    }

    if (user) setUser(user);
    if (hasStoredQuestions) {
    } else if (questions) {
      setQuestions(questions);
    }

    setStarted(true);
  }, [
    questionsReady,
    user,
    questions,
    hasStoredQuestions,
    setUser,
    setQuestions
  ]);

  useEffect(() => {
    if (selectedSubjectsParameters.length !== 3) {
      router.push('/dashboard');
    }
  }, [selectedSubjectsParameters, router]);

  useEffect(() => {
    if (hasStoredQuestions) {
      if (fetchData) {
        setFetchData(false);
      }
    } else {
      if (!fetchData) {
        setFetchData(true);
      }
    }
  }, [hasStoredQuestions, fetchData, setFetchData]);

  useEffect(() => {
    if (hasStoredQuestions && !started && !userLoading) {
      startPractice();
    }
  }, [hasStoredQuestions, started, userLoading, startPractice]);

  if (userError || questionsError) {
    return (
      <>
        {userError && (
          <Status
            image="/assets/error.svg"
            desc1={`User Error: ${String(userError)}`}
            desc2="Couldn't fetch your profile."
          />
        )}
        {questionsError && (
          <Status
            image="/assets/error.svg"
            desc1={`Questions Error: ${String(questionsError?.message ?? questionsError)}`}
            desc2="Couldn't load your questions."
          />
        )}
      </>
    );
  }

  if (hasStoredQuestions && (started || hasStarted.current)) {
    return <Practice />;
  }

  if (userLoading || questionsLoading || !questionsReady) {
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

  if (!started) {
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
