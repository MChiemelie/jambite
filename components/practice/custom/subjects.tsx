'use client';

import { subjectPathMap } from '@/data/subjects';
import { usePracticeActions, useQuestions, useSelectedSubject, useUnattemptedQuestions } from '@/stores/practice';
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
    <div className="flex items-center gap-3 uppercase w-full">
      <div className="flex gap-2 items-center w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:max-w-[950px] place-items-stretch">
          {Object.keys(questions).map((subject) => (
            <span key={subject} onClick={() => handleSubjectChange(subject)} className={`flex flex-col justify-center items-center w-full p-2 rounded cursor-pointer text-center ${selectedSubject === subject ? 'text-accent-2 border-2 border-accent-2' : 'bg-accent-2 text-white'}`}>
              {subjectPathMap[subject] || subject}
            </span>
          ))}
        </div>
        <span className="hidden md:block p-2 bg-accent-2 rounded text-white">
          <CalculatorDialog />
        </span>
      </div>
    </div>
  );
}
