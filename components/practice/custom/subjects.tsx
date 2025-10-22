'use client';

import { subjectPathMap } from '@/data/subjects';
import {
  usePracticeActions,
  useQuestions,
  useSelectedSubject,
  useUnattemptedQuestions
} from '@/stores/practice';
import CalculatorDialog from './calculator';

export default function Subjects() {
  const selectedSubject = useSelectedSubject();
  const unattemptedQuestions = useUnattemptedQuestions();
  const questions = useQuestions();

  const { setCurrentQuestion, setSelectedSubject } = usePracticeActions();

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    const unattempted = unattemptedQuestions[subject] || [];
    const idx = questions[subject]?.findIndex((q) => q.id === unattempted[0]);
    setCurrentQuestion(idx !== -1 ? idx : 0);
  };

  return (
    <div className="flex w-full items-center gap-3 uppercase">
      <div className="flex w-full items-center gap-2">
        <div className="grid w-full grid-cols-2 place-items-stretch gap-2 sm:grid-cols-4 lg:max-w-[950px]">
          {Object.keys(questions).map((subject) => (
            <button
              type="button"
              key={subject}
              onClick={() => handleSubjectChange(subject)}
              className={`flex w-full cursor-pointer flex-col items-center justify-center rounded p-2 text-center uppercase ${selectedSubject === subject ? 'text-accent-2 border-accent-2 border-2' : 'bg-accent-2 text-white'}`}
            >
              {subjectPathMap[subject] || subject}
            </button>
          ))}
        </div>
        <span className="bg-accent-2 hidden rounded p-2 text-white md:block">
          <CalculatorDialog />
        </span>
      </div>
    </div>
  );
}
