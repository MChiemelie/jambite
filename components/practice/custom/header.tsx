'use client';

import { Report } from '@/components/practice';
import { useCurrentQuestion, useQuestions, useSelectedSubject, useSubmitted } from '@/stores/practice';
import { Question } from '@/types';
import { useMemo } from 'react';

export default function Header() {
  const currentQuestion = useCurrentQuestion();
  const questions = useQuestions();
  const selectedSubject = useSelectedSubject();
  const submitted = useSubmitted();

  const currentQuestionsData = useMemo(() => questions[selectedSubject] ?? [], [questions, selectedSubject]);

  const currentQuestionData: Question | undefined = currentQuestionsData[currentQuestion];
  const currentQuestionId = currentQuestionData?.id ?? null;

  return (
    <div className="p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="uppercase text-accent-2 text-center">{selectedSubject}</p>
        <p>Question {currentQuestion + 1}</p>
      </div>
      {submitted && currentQuestionId !== null && <Report />}
    </div>
  );
}
