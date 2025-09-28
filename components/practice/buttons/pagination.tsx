'use client';

import { useMemo } from 'react';
import { useCurrentQuestion, usePracticeActions, useQuestions, useSelectedAnswers, useSelectedSubject } from '@/stores/practice';

export default function Pagination() {
  const questions = useQuestions();
  const selectedAnswers = useSelectedAnswers();
  const subject = useSelectedSubject();
  const currentQuestion = useCurrentQuestion();

  const { setCurrentQuestion } = usePracticeActions();

  const currentQuestionsData = useMemo(() => questions[subject] ?? [], [questions, subject]);

  const handlePaginationClick = (i: number) => setCurrentQuestion(i);

  return (
    <div className="flex flex-wrap text-white gap-1">
      {currentQuestionsData.map((question, index) => (
        <span
          key={question.id}
          className={`p-1 rounded-sm w-10 text-center
                      ${currentQuestion === index && selectedAnswers[question.id] === undefined ? 'text-accent-2 border-2 border-accent-2' : ''}
                      ${currentQuestion === index && selectedAnswers[question.id] !== undefined ? 'text-accent-3 border-2 border-accent-3' : ''}
                      ${currentQuestion !== index && selectedAnswers[question.id] === undefined ? 'bg-accent-2' : ''}
                      ${currentQuestion !== index && selectedAnswers[question.id] !== undefined ? 'bg-accent-3' : ''}
                    `}
          onClick={() => handlePaginationClick(index)}
        >
          {index + 1}
        </span>
      ))}
    </div>
  );
}
