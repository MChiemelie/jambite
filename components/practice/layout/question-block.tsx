'use client';

import type { Question } from '@/types';
import { useCurrentQuestion, useQuestions, useSelectedSubject } from '@/stores/practice';
import { useMemo } from 'react';
import { Options, QuestionSection } from '@/components/practice';

export default function QuestionBlock() {
  const currentQuestion = useCurrentQuestion();
  const questions = useQuestions();
  const selectedSubject = useSelectedSubject();

  const currentQuestionsData = useMemo(() => questions[selectedSubject] ?? [], [questions, selectedSubject]);
  const currentQuestionData: Question | undefined = currentQuestionsData[currentQuestion];

  return (
    <>
      {currentQuestionData && (
        <div className="flex flex-col gap-6 border-y-2 border-gray-300 p-6 text-sm md:text-lg">
          <QuestionSection />
          <Options />
        </div>
      )}
    </>
  );
}
