'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { useUser } from '@/contexts';
import { getUserData } from '@/services';
import { usePracticeActions, useSelectedSubjects } from '@/stores/practice';

const subjects = ['Use of English', 'Mathematics', 'Commerce', 'Accounting', 'Biology', 'Physics', 'Chemistry', 'Lit. In English', 'Government', 'Christian Rel. Know', 'Geography', 'Economics', 'Islamic Rel. Know', 'Civic Education', 'History'];

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
  History: 'history'
};

export default function SelectSubjects() {
  const router = useRouter();
  const selectedSubjects = useSelectedSubjects();
  const { setSelectedSubjects, setSelectedSubjectsParameters } = usePracticeActions();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setSelectedSubjects([]);
      return;
    }

    const mapped =
      (user.subjects || [])
        .map((param: string) => {
          const label = subjects.find((name) => subjectMap[name] === param);
          return label ?? null;
        })
        .filter(Boolean)
        .filter((label) => label !== ENGLISH) || [];

    setSelectedSubjects(mapped as string[]);
  }, [user, setSelectedSubjects]);

  const handleCheckboxChange = (subject: string) => {
    if (subject === ENGLISH) return;

    const already = selectedSubjects.includes(subject);

    if (already) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      setMessage('');
      return;
    }

    if (selectedSubjects.length < 3) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setMessage('');
      return;
    }

    setMessage('You can only pick 3 subjects in addition to Use of English.');

    window.setTimeout(() => setMessage(''), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const userData = await getUserData().catch(() => ({ trials: 0 }));
      const trials = userData?.trials ?? 0;
      if (trials === 0) {
        setIsLoading(false);
        router.push('/payments');
        return;
      }

      if (selectedSubjects.length !== 3) {
        setMessage(`Pick exactly 3 subjects (you picked ${selectedSubjects.length}).`);
        setIsLoading(false);
        return;
      }

      const params = selectedSubjects.map((label) => {
        const slug = subjectMap[label];
        if (!slug) throw new Error(`Unknown subject: ${label}`);
        return slug;
      });

      setSelectedSubjectsParameters(params);

      setIsLoading(false);
      router.push('/practice');
    } catch (err) {
      console.error('SelectSubjects submit error', err);
      setMessage('Something went wrong. Try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-muted/50 mx-auto flex w-full flex-col gap-6 rounded p-4 md:h-full'>
      <p className='text-center text-xs italic'>You can only take four subjects per practice. Use of English has already been selected for you.</p>

      <div className='xs:grid-cols-2 md:text-md grid grid-cols-1 place-content-evenly gap-4 text-sm'>
        {subjects.map((subject) => {
          const isEnglish = subject === ENGLISH;
          const checked = isEnglish ? true : selectedSubjects.includes(subject);
          const disabled = isEnglish;

          return (
            <div key={subject} className='flex items-center gap-2'>
              <Label className='flex items-center gap-2'>
                <Checkbox id={subject} checked={checked} disabled={disabled} onCheckedChange={() => handleCheckboxChange(subject)} aria-label={subject} />
                {subject}
              </Label>
            </div>
          );
        })}
      </div>

      {message && <p className='text-center text-xs text-red-500'>{message}</p>}

      <Button type='submit' disabled={isLoading} className='mx-auto w-full sm:w-[60%]'>
        {isLoading ? 'Loading…' : 'Submit'}
      </Button>
    </form>
  );
}
