'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Status } from '@/components/custom';
import { Practice } from '@/components/practice';
import { decrementTrials } from '@/services/payments';
import { useFetchData, usePracticeActions, useSelectedSubjectsParameters } from '@/stores/practice';
import { useUser, useQuestions } from '@/hooks';

export default function PracticePage() {
  const router = useRouter();
  const hasRun = useRef(false);

  const selectedSubjects = useSelectedSubjectsParameters();
  const fetchData = useFetchData();
  // const canPractice = useQuestions();

  const { setUser, setQuestions, setFetchData } = usePracticeActions();

  const { user, userLoading, userError } = useUser(fetchData);;
  const { questions, questionsLoading, questionsError } = useQuestions(fetchData);

  useEffect(() => {
    if (!user || !questions) return;

    if (selectedSubjects.length !== 3) {
      if (!hasRun.current) return;
      router.push('/dashboard');
      return;
    }

    if (!hasRun.current) {
      hasRun.current = true;
      setFetchData(false);
    }

    if (fetchData) {
      console.log("Tried to fetch data")
      decrementTrials();
      setUser(user);
      setQuestions(questions);
    }

  }, [selectedSubjects, user, questions, setUser, setQuestions, router]);

  if (userLoading || questionsLoading) {
    return <Status image="/assets/questions.svg" desc1="We are compiling your questions…" desc2="Almost there!" />;
  }

  if (userError || questionsError) {
    return (
      <>
        {userError && <Status image="/assets/error.svg" desc1={`User Error: ${userError?.message}`} desc2="Couldn’t fetch your profile." />}
        {questionsError && <Status image="/assets/error.svg" desc1={`Questions Error: ${questionsError?.message}`} desc2="Couldn’t load your questions." />}
      </>
    );
  }

  return <Practice />;
}
