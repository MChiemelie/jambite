'use client';

import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CandidateProps {
  subject: string;
}

export default function Candidate({ subject }: CandidateProps) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const { numberAttempted, totalNumberAttempted, questions } = useSelector((state: RootState) => state.practice);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      if (session?.user) {
        setUser(session.user);
      }
    };

    fetchUser();
  }, [supabase]);

  const totalQuestionsForSubject = questions[subject]?.length || 40;
  const totalQuestions = Object.values(questions).reduce((acc, subjectQuestions) => acc + (subjectQuestions?.length || 0), 0);
  const attemptsForSubject = numberAttempted[subject] || 0;

  return (
    <div className="border-2 border-gray-300 font-semibold rounded w-full max-w-64 mx-auto">
      <h2 className="border-b-2 p-3 text-center">Candidate Details</h2>
      <div className="text-center rounded p-3 space-y-3">
        <Image src="/qr.png" alt="QR Code" width={100} height={100} className="mx-auto" />
        <Image src={user?.user_metadata?.avatar_url || '/default-avatar.png'} alt="Avatar" width={100} height={100} className="mx-auto" />
        <p className="text-accent-2 uppercase">{user?.user_metadata?.full_name || 'Name not available'}</p>
        <p className="text-accent-2">{user?.user_metadata?.provider_id || 'User ID'}</p>
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
