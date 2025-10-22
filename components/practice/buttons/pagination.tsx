'use client';

import { useMemo } from 'react';
import {
  useCurrentQuestion,
  usePracticeActions,
  useQuestions,
  useSelectedAnswers,
  useSelectedSubject
} from '@/stores/practice';

export default function Pagination() {
  const questions = useQuestions();
  const selectedAnswers = useSelectedAnswers();
  const subject = useSelectedSubject();
  const currentQuestion = useCurrentQuestion();

  const { setCurrentQuestion } = usePracticeActions();

  const currentQuestionsData = useMemo(
    () => questions[subject] ?? [],
    [questions, subject]
  );

  const handlePaginationClick = (i: number) => setCurrentQuestion(i);

  return (
    <div className="grid grid-cols-5 gap-2 p-2 sm:grid-cols-10 md:p-4">
      {currentQuestionsData.map((question, index) => {
        const isAnswered = question.id in selectedAnswers;
        return (
          <button
            key={question.id}
            type="button"
            onClick={() => handlePaginationClick(index)}
            className={`flex h-10 w-10 items-center justify-center rounded font-medium transition-colors ${currentQuestion === index ? 'bg-red-600 text-white' : isAnswered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            aria-label={`Go to question ${index + 1}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
