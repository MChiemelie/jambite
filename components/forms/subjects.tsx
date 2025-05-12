'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserData } from '@/services';
import { Button } from '@/components/shadcn/button';
import { usePracticeActions, useSelectedSubjects } from '@/stores/practice';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];
const parameters = ['english', 'mathematics', 'commerce', 'accounting', 'biology', 'physics', 'chemistry', 'englishlit', 'government', 'crk', 'geography', 'economics', 'irk', 'civiledu', 'history'];
const ENGLISH = subjects[0];

export default function SelectSubjects() {
  const router = useRouter();
  const selectedSubjects = useSelectedSubjects();
  const { setSelectedSubjects, setSelectedSubjectsParameters } = usePracticeActions();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (subject: string) => {
    const already = selectedSubjects.includes(subject);
    const next = already ? selectedSubjects.filter((s) => s !== subject) : selectedSubjects.length < 3 ? [...selectedSubjects, subject] : selectedSubjects;
    setSelectedSubjects(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { trials } = await getUserData();
    if (trials === 0) return router.push('/payments');

    if (selectedSubjects.length !== 3) {
      setMessage(`Select exactly 3 more (you picked ${selectedSubjects.length}).`);
      setIsLoading(false);
      return;
    }

    const params = selectedSubjects.map((subj) => {
      return parameters[subjects.indexOf(subj)];
    });
    setSelectedSubjectsParameters(params);

    router.push('/practice');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col bg-muted/50 rounded w-full h-full p-4 gap-6 mx-auto">
      <p className="text-xs text-center italic">
        You can only take four subjects per practice. <br /> Use of English has already been selected for you.
      </p>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm md:text-md">
        {subjects.map((subject, i) => (
          <label key={parameters[i]} className="flex items-center">
            <input type="checkbox" checked={subject === ENGLISH || selectedSubjects.includes(subject)} disabled={subject === ENGLISH} onChange={() => handleCheckboxChange(subject)} />
            <span className="ml-2">{subject}</span>
          </label>
        ))}
      </div>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <Button type="submit" disabled={isLoading} className="w-[60%] mx-auto">
        {isLoading ? 'Loading…' : 'Submit'}
      </Button>
    </form>
  );
}
