'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Status } from '@/components/custom';
import { Practice } from '@/components/practice';
import { getUserData } from '@/services/auth';
import { decrementTrials } from '@/services/payments';
import { getQuestions } from '@/services/questions';
import { AppDispatch, RootState } from '@/stores';
import { setQuestions, setUser } from '@/stores/practice/slice';
import { randomYear } from '@/utilities';

export default function PracticePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSubjectsParameters, selectedSubjects } = useSelector((state: RootState) => state.practice);

  const { status: userStatus, data: user, error: userError } = useQuery({ queryKey: ['user'], queryFn: getUserData });

  // prettier-ignore
  const { status: questionsStatus, data: questions, error: questionsError } = useQuery({
    queryKey: ['questions', selectedSubjectsParameters],
    queryFn: async () => getQuestions(selectedSubjectsParameters, randomYear()),
    enabled: selectedSubjects.length > 0,
  });

  useEffect(() => {
    if (selectedSubjects.length === 0) {
      router.push('/dashboard');
      return;
    }

    if (userStatus === 'success' && questionsStatus === 'success') {
      decrementTrials();
      dispatch(setUser(user));
      dispatch(setQuestions(questions));
    }
  }, [selectedSubjects, router, userStatus, questionsStatus, user, questions, dispatch]);

  if (userStatus === 'pending' || questionsStatus === 'pending') return <Status image="/assets/questions.svg" desc1="We're gathering and compling your questions" desc2="This may take a while, please stay with us!" />;

  if (userStatus === 'error' || questionsStatus === 'error') {
    return (
      <span>
        {userError && <Status image="/assets/error.svg" desc1={`User Error: ${userError.message}`} desc2="" />}
        <br />
        {questionsError && <Status image="/assets/error.svg" desc1={`Questions Error: ${questionsError.message}`} desc2="" />}
      </span>
    );
  }

  return <Practice questions={questions} />;
}
