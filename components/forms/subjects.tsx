'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { useUser } from '@/contexts';
import { getUserData } from '@/services';
import { usePracticeActions, useSelectedSubjects } from '@/stores/practice';
import { useRouter } from 'next/navigation';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];

const parameters = ['english', 'mathematics', 'commerce', 'accounting', 'biology', 'physics', 'chemistry', 'englishlit', 'government', 'crk', 'geography', 'economics', 'irk', 'civiledu', 'history'];

const ENGLISH = subjects[0];

const subjectMap: Record<string, string> = {
  'Use of English': 'english',
  Mathematics: 'mathematics',
  Commerce: 'commerce',
  Accounting: 'accounting',
  Biology: 'biology',
  Physics: 'physics',
  Chemistry: 'chemistry',
  'Lit. In English': 'englishlit',
  Government: 'government',
  'Christian Rel. Know': 'crk',
  Geography: 'geography',
  Economics: 'economics',
  'Islamic Rel. Know': 'irk',
  'Civic Education': 'civiledu',
  History: 'history',
};

export default function SelectSubjects() {
  const router = useRouter();
  const selectedSubjects = useSelectedSubjects();
  const { setSelectedSubjects, setSelectedSubjectsParameters } = usePracticeActions();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser(true);

  useEffect(() => {
    if (user?.subjects?.length) {
      const mapped = user.subjects.map((param) => subjects.find((name) => subjectMap[name] === param) || ENGLISH).filter((s) => s !== ENGLISH);

      setSelectedSubjects([...mapped]);
    } else {
      setSelectedSubjects([ENGLISH]);
    }
  }, [user, setSelectedSubjects]);

  const handleCheckboxChange = (subject: string) => {
    const already = selectedSubjects.includes(subject);

    if (already) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < 3) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      setMessage('You can only pick 3 subjects in addition to Use of English.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const { trials } = await getUserData();
    if (trials === 0) {
      router.push('/payments');
      return;
    }

    if (selectedSubjects.length !== 3) {
      setMessage(`Pick exactly 3 subjects (you picked ${selectedSubjects.length}).`);
      setIsLoading(false);
      return;
    }

    const params = selectedSubjects.map((subj) => parameters[subjects.indexOf(subj)]);
    setSelectedSubjectsParameters(params);

    router.push('/practice');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col bg-muted/50 rounded w-full md:h-full p-4 gap-6 mx-auto">
      <p className="text-xs text-center italic text-justify">You can only take four subjects per practice. Use of English has already been selected for you.</p>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm md:text-md place-content-evenly">
        {subjects.map((subject, i) => {
          const isEnglish = subject === ENGLISH;
          const checked = selectedSubjects.includes(subject);
          const disabled = isEnglish;

          return (
            <div key={parameters[i]} className="flex items-center gap-2">
              <Label className="flex items-center gap-2">
                <Checkbox id={parameters[i]} checked={checked || isEnglish} disabled={disabled} onCheckedChange={() => handleCheckboxChange(subject)} aria-label={subject} />
                {subject}
              </Label>
            </div>
          );
        })}
      </div>

      {message && <p className="text-red-500 text-center text-xs">{message}</p>}

      <Button type="submit" disabled={isLoading} className="w-full sm:w-[60%] mx-auto">
        {isLoading ? 'Loading…' : 'Submit'}
      </Button>
    </form>
  );
}
