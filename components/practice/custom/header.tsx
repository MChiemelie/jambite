'use client';

import { useMemo } from 'react';
import { Report } from '@/components/practice';
import {
  useCurrentQuestion,
  useQuestions,
  useSelectedSubject,
  useSubmitted
} from '@/stores/practice';
import type { Question } from '@/types';
import { KeyboardShortcutsDialog } from './tips';

export default function QuestionHeader() {
  const currentQuestion = useCurrentQuestion();
  const questions = useQuestions();
  const selectedSubject = useSelectedSubject();
  const submitted = useSubmitted();

  const currentQuestionsData = useMemo(
    () => questions[selectedSubject] ?? [],
    [questions, selectedSubject]
  );

  const currentQuestionData: Question | undefined =
    currentQuestionsData[currentQuestion];
  const currentQuestionId = currentQuestionData?.id ?? null;

  return (
    <header className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row sm:items-start md:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-accent-2 text-center uppercase">{selectedSubject}</p>
        <p className="text-center sm:text-justify">
          Question {currentQuestion + 1}
        </p>
      </div>
      {submitted && currentQuestionId !== null ? (
        <Report />
      ) : (
        <KeyboardShortcutsDialog />
      )}
    </header>
  );
}
