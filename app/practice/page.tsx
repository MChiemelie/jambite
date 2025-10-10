'use client';

import { useEffect, useRef } from 'react';
import { Status } from '@/components/custom';
import { Practice } from '@/components/practice';
import { useQuestions, useUser } from '@/contexts';
import { decrementTrials } from '@/services/payments';
import { useFetchData, usePracticeActions, useSelectedSubjectsParameters } from '@/stores/practice';
import { useRouter } from 'next/navigation';

export default function PracticePage() {
  const router = useRouter();
  const hasRun = useRef(false);

  const selectedSubjectsParameters = useSelectedSubjectsParameters();
  const fetchData = useFetchData();

  const { setUser, setQuestions, setFetchData } = usePracticeActions();

  const { user, isLoading: userLoading, isError:userError } = useUser();
  const { questions, questionsLoading, questionsError } = useQuestions(fetchData);

  useEffect(() => {
    if (!user || !questions) return;

    if (selectedSubjectsParameters.length !== 3) {
      if (!hasRun.current) return;
      router.push('/dashboard');
      return;
    }

    if (!hasRun.current) {
      hasRun.current = true;
      setFetchData(false);
    }

    if (fetchData) {
      decrementTrials();
      setUser(user);
      setQuestions(questions);
    }
  }, [selectedSubjectsParameters, user, questions, setUser, setQuestions, router, fetchData, setFetchData]);

  if (userLoading || questionsLoading) {
    return <Status image="/assets/questions.svg" desc1="We are compiling your questions." desc2="This might take  2 - 3 minutes. Please be patient." />;
  }

  if (userError || questionsError) {
    return (
      <>
        {userError && <Status image="/assets/error.svg" desc1={`User Error: ${userError}`} desc2="Couldn’t fetch your profile." />}
        {questionsError && <Status image="/assets/error.svg" desc1={`Questions Error: ${questionsError?.message}`} desc2="Couldn’t load your questions." />}
      </>
    );
  }

  return <Practice />;
}
