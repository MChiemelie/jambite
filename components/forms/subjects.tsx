'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getUserData } from '@/services';
import { AppDispatch, RootState } from '@/stores';
import { reset, setSelectedSubjects, setSelectedSubjectsParameters } from '@/stores/practice/slice';
import { Button } from '../shadcn/button';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];
const parameters = ['english', 'mathematics', 'commerce', 'accounting', 'biology', 'physics', 'chemistry', 'englishlit', 'government', 'crk', 'geography', 'economics', 'irk', 'civiledu', 'history'];
const english = subjects[0];

export default function SelectSubjects() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { selectedSubjects } = useSelector((state: RootState) => state.practice);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const handleCheckboxChange = (subject: string) => {
    const updatedSubjects = selectedSubjects.includes(subject) ? selectedSubjects.filter((s) => s !== subject) : selectedSubjects.length < 3 ? [...selectedSubjects, subject] : selectedSubjects;

    dispatch(setSelectedSubjects(updatedSubjects));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const { trials } = await getUserData();

    if (trials === 0) {
      router.push('/payments');
      return;
    }

    if (selectedSubjects.length !== 3) {
      setMessage(`Please select exactly 3 additional subjects (You selected ${selectedSubjects.length}).`);
      setIsLoading(false);
      return;
    }

    const selectedParameters = selectedSubjects.map((subject) => {
      const index = subjects.indexOf(subject);
      return parameters[index];
    });

    dispatch(setSelectedSubjectsParameters(selectedParameters));
    router.push('/practice');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-muted/50 rounded w-full h-full p-4 gap-6 mx-auto">
      <p className="text-xs text-center italic">
        You can only take four subjects per practice. <br /> Use of English has already been selected for you.
      </p>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm md:text-md">
        {subjects.map((subject, index) => (
          <div key={parameters[index]} className="flex items-center">
            <input type="checkbox" id={parameters[index]} checked={subject === english || selectedSubjects.includes(subject)} onChange={() => handleCheckboxChange(subject)} disabled={subject === english} />
            <label htmlFor={parameters[index]} className="ml-2">
              {subject}
            </label>
          </div>
        ))}
      </div>

      {message && <p className="text-red-500 text-center text-sm md:text-md">{message}</p>}

      <Button type="submit" className="flex w-[60%] mx-auto" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
    </form>
  );
}
