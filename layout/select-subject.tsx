'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setSelectedSubjects, setSelectedSubjectsParameters } from '@/store/practiceSlice';
import { useRouter } from 'next/navigation';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];

const parameters = ['english', 'mathematics', 'commerce', 'accounting', 'biology', 'physics', 'chemistry', 'englishlit', 'government', 'crk', 'geography', 'economics', 'irk', 'civiledu', 'history'];

const english = subjects[0];

export default function SelectSubject() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { selectedSubjects } = useSelector((state: RootState) => state.practice);
  const [message, setMessage] = useState('');

  console.log('Selected Subjects:', selectedSubjects);

  // Handle checkbox selection
  const handleCheckboxChange = (subject: string) => {
    const updatedSubjects = selectedSubjects.includes(subject) ? selectedSubjects.filter((s) => s !== subject) : selectedSubjects.length < 3 ? [...selectedSubjects, subject] : selectedSubjects;
    dispatch(setSelectedSubjects(updatedSubjects));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedSubjects.length !== 3) {
      setMessage('Please select three additional subjects.');
      return;
    }

    // Map selected subjects to corresponding parameters
    const selectedParameters = selectedSubjects.map((subject) => {
      const index = subjects.indexOf(subject);
      return parameters[index];
    });

    // Dispatch selected parameters to Redux store
    dispatch(setSelectedSubjectsParameters(selectedParameters));

    // Log selected parameters for debugging
    console.log('Selected Parameters:', selectedParameters);

    // Redirect to practice page after validation
    router.push('/practice');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 rounded-sm backdrop-filter backdrop-blur-lg bg-opacity-10 p-4 w-[80%] max-w-[800px] mx-auto my-4 space-y-3">
      <p className="text-xs text-center">
        <i>You can only take four subjects per exam. Use of English has already been selected for you as a compulsory subject.</i>
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm md:text-lg p-4 sm:p-8">
        {subjects.map((subject, index) => (
          <div key={parameters[index]} className="flex items-center">
            <input type="checkbox" id={parameters[index]} checked={subject === english || selectedSubjects.includes(subject)} onChange={() => handleCheckboxChange(subject)} disabled={subject === english} />
            <label htmlFor={parameters[index]} className="ml-2">
              {subject}
            </label>
          </div>
        ))}
      </div>

      {message && <p className="text-red-500 text-center">{message}</p>}

      <button type="submit" className="flex bg-purple-600 text-white px-12 py-2 rounded mx-auto" disabled={selectedSubjects.length !== 3}>
        Submit
      </button>
    </form>
  );
}
