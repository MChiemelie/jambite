"use client";

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubjectSelect() {
  const subjects = [
    'English Language', 'Mathematics', 'Commerce', 'Accounting', 'Biology',
    'Physics', 'Chemistry', 'Literature-In-English', 'Government',
    'Christian Religious Knowledge', 'Geography', 'Economics', 'Islamic Religious Knowledge',
    'Civic Education', 'Insurance', 'Current Affairs', 'History'
  ];

  const routes = [
    'english', 'mathematics', 'commerce', 'accounting', 'biology', 'physics',
    'chemistry', 'englishlit', 'government', 'crk', 'geography', 'economics',
    'irk', 'civiledu', 'insurance', 'currentaffairs', 'history'
  ];

  const router = useRouter();

  const [selectedSubject, setSelectedSubject] = useState(-1);

  const handleStartTest = () => {
    const selectedRoute = routes[selectedSubject];
    if (selectedRoute) {
      router.push(`/dashboard/${selectedRoute}`);
    }
  };

  return (
    <div className=" w-full">
      <h1 className='text-bold text-center text-xl lg:text-2xl font-normal py-2'>Take A Test Now</h1>
      <div className='w-full'>
        <select className="flex mx-auto border py-2 md:py-3 px-4 w-5/6 max-w-lg md:px-5 rounded" value={selectedSubject} onChange={(e) => setSelectedSubject(parseInt(e.target.value))}>
          <option value={-1}>Choose A Subject</option>
          {subjects.map((subject, index) => (
            <option key={index} value={index}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      <button aria-label="Submit" className="flex my-4 mx-auto bg-accent-1 text-white text-lg p-1 lg:py-2 w-2/5 sm:w-1/5 lg:w-1/6 rounded justify-center"onClick={handleStartTest}>
      Start!
    </button>
  </div >
  )
}
