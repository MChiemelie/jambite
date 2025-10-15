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
 useSelectedSubjectsParameters
} from '@/stores/practice';

export default function PracticePage() {
 const router = useRouter();
 const hasStarted = useRef(false); // prevents double start
 const selectedSubjectsParameters = useSelectedSubjectsParameters();
 const fetchData = useFetchData();

 const { setUser, setQuestions, setFetchData } = usePracticeActions();

 const { user, isLoading: userLoading, isError: userError } = useUser();
 const { questions, questionsLoading, questionsError } =
  useQuestions(fetchData);

 // local flag to indicate we've moved from waiting -> started UI
 const [started, setStarted] = useState(false);

 // when fetchData is true the store logic should run: decrementTrials + setUser/setQuestions
 useEffect(() => {
  if (!fetchData) return;

  // this action should only happen once per fetch cycle
  if (hasStarted.current) return;
  hasStarted.current = true;

  // keep existing behavior: decrement trial and populate store
  decrementTrials();
  if (user) setUser(user);
  if (questions) setQuestions(questions);

  // mark UI as started so we show <Practice />
  setStarted(true);
 }, [fetchData, user, questions, setUser, setQuestions]);

 // sanity redirect: ensure 3 subjects selected
 useEffect(() => {
  if (selectedSubjectsParameters.length !== 3) {
   router.push('/dashboard');
  }
 }, [selectedSubjectsParameters, router]);

 // helper to start the practice flow (wired to Start button or auto-start)
 const startPractice = useCallback(() => {
  if (hasStarted.current) return;
  // flipping this to true will trigger the effect above to populate store
  setFetchData(true);
 }, [setFetchData]);

 // Auto-start when user & questions are loaded and we haven't started yet.
 useEffect(() => {
  if (started) return; // already started
  if (!user || !questions) return; // not ready yet
  // safe start
  startPractice();
 }, [user, questions, started, startPractice]);

 // UI states
 if (userLoading || questionsLoading) {
  return (
   <Awaiting
    estimatedSeconds={180}
    onCancel={() => router.push('/dashboard')}
    onTimeEnd={() => {
     // fallback: start anyway when timer ends
     startPractice();
    }}
   />
  );
 }

 if (userError || questionsError) {
  return (
   <>
    {userError && (
     <Status
      image='/assets/error.svg'
      desc1={`User Error: ${String(userError)}`}
      desc2='Couldn’t fetch your profile.'
     />
    )}
    {questionsError && (
     <Status
      image='/assets/error.svg'
      desc1={`Questions Error: ${String(questionsError?.message ?? questionsError)}`}
      desc2='Couldn’t load your questions.'
     />
    )}
   </>
  );
 }

 // If we've started (store populated) show practice; otherwise still show waiting.
 if (!started) {
  // Edge-case: everything loaded but started flag not yet set — show the waiting component but with Start enabled.
  return (
   <Awaiting
    estimatedSeconds={30}
    onCancel={() => router.push('/dashboard')}
    onTimeEnd={startPractice}
   />
  );
 }

 return <Practice />;
}
