'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { RootState } from '@/stores';
import { CandidateDetails } from '@/types';

export default function Candidate({ subject }: CandidateDetails) {
  const { numberAttempted, totalNumberAttempted, questions, user } = useSelector((state: RootState) => state.practice);

  const totalQuestions = Object.values(questions).reduce((acc, subjectQuestions) => acc + (subjectQuestions?.length || 0), 0);
  const attemptsForSubject = numberAttempted[subject] || 0;
  const totalQuestionsForSubject = questions[subject]?.length || 0;

  return (
    <div className="border-2 border-gray-300 rounded w-full max-w-64 mx-auto">
      <h2 className="border-b-2 border-gray-300 p-3 text-center">Candidate Details</h2>
      <div className="flex flex-col text-center rounded p-3 gap-3">
        <Image src="/images/special/qr.png" alt="QR Code" width={100} height={100} className="mx-auto" />
        <Image src={user?.avatar || '/default-avatar.png'} alt="Avatar" width={100} height={100} className="mx-auto" />
        <p className="text-accent-2 uppercase">{user?.fullname || 'JOE DOE'}</p>
        <p className="text-accent-2">{user?.userId || '0123456789'}</p>
        <p>Seat Number: 1234</p>
        <p>
          Attempted {attemptsForSubject} of {totalQuestionsForSubject}
          <br />
          <span className="text-accent-2 uppercase">{subject}</span>
        </p>
        <p>
          Total Attempts {totalNumberAttempted} of {totalQuestions}
        </p>
      </div>
    </div>
  );
}
