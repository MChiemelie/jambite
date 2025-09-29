'use client';

import { useUser } from '@/contexts';
import { useNumberAttempted, useQuestions, useSelectedSubject, useTotalNumberAttempted } from '@/stores/practice';
import Image from 'next/image';

export default function Candidate() {
  const numberAttempted = useNumberAttempted();
  const totalNumberAttempted = useTotalNumberAttempted();
  const questions = useQuestions();
  const { user } = useUser();
  const selectedSubject = useSelectedSubject();

  const totalQuestions = Object.values(questions).reduce((acc, subjectQuestions) => acc + (subjectQuestions?.length || 0), 0);
  const attemptsForSubject = numberAttempted[selectedSubject] || 0;
  const totalQuestionsForSubject = questions[selectedSubject]?.length || 0;

  return (
    <aside className="border-2 border-gray-300 rounded w-full md:max-w-64 mx-auto">
      <h2 className="border-b-2 border-gray-300 p-3 text-center">Candidate Details</h2>
      <div className="flex flex-col text-center rounded p-3 gap-3">
        <Image src="/images/special/qr.png" alt="QR Code" width={100} height={100} className="mx-auto" />
        <Image src={user?.avatarUrl || '/images/special/profile-picture.png'} alt="Avatar" width={100} height={100} className="mx-auto aspect-square w-24 h-24 rounded object-cover" />
        <p className="text-accent-2 uppercase">{user?.fullname || 'JOE DOE'}</p>
        <p className="text-accent-2 uppercase">{user?.userId || '0123456789'}</p>
        <p>Seat Number: 1234</p>
        <p>
          Attempted {attemptsForSubject} of {totalQuestionsForSubject}
          <br />
          <span className="text-accent-2 uppercase">{selectedSubject}</span>
        </p>
        <p>
          Total Attempts {totalNumberAttempted} of {totalQuestions}
        </p>
      </div>
    </aside>
  );
}
