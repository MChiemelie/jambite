'use client';

import { useMemo } from 'react';
import { Options, QuestionSection } from '@/components/practice';
import {
  useCurrentQuestion,
  useQuestions,
  useSelectedSubject
} from '@/stores/practice';
import type { Question } from '@/types';

export default function QuestionBlock() {
  const currentQuestion = useCurrentQuestion();
  const questions = useQuestions();
  const selectedSubject = useSelectedSubject();

  const currentQuestionsData = useMemo(
    () => questions[selectedSubject] ?? [],
    [questions, selectedSubject]
  );
  const currentQuestionData: Question | undefined =
    currentQuestionsData[currentQuestion];

  return (
    <>
      {currentQuestionData && (
        <main className='flex flex-col gap-6 border-y-2 border-gray-300 p-4 md:p-6 md:text-lg'>
          <QuestionSection />
          <Options />
        </main>
      )}
    </>
  );
}
