'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setQuestions, setUser } from '@/store/practiceSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getQuestions } from '@/fetchQuestions';
import { Practice } from '@/layout/practice';

export default function PracticePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSubjectsParameters, questions } = useSelector((state: RootState) => state.practice);
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('We are at the practice page');

    const fetchData = async () => {
      try {
        const {data: { user }} = await supabase.auth.getUser();

        // Handle user authentication
        if (user) {
          dispatch(setUser(user));
            console.log("Practice User:", user);
        } else {
          console.log('We cannot set the user');
        }

        // Fetch questions if subjects are selected
        if (selectedSubjectsParameters.length > 0) {
          const randomYear = getRandomYear();
          const questionsData = await getQuestions(selectedSubjectsParameters, randomYear);
          dispatch(setQuestions(questionsData));
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [dispatch, selectedSubjectsParameters, supabase]);

  const getRandomYear = () => {
    const years = ['2000', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'];
    return years[Math.floor(Math.random() * years.length)];
  };

  if (error) {
    throw new Error(error); // Trigger error boundary
  }

  return (
    questions ? <Practice questions={questions} /> : <p>No questions available.</p>
  );
}