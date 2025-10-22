'use client';

import { useCallback, useMemo } from 'react';
import { useKey } from 'react-use';
import {
  useCurrentQuestion,
  usePracticeActions,
  useQuestions,
  useSelectedSubject
} from '@/stores/practice';

export default function NextQuestionButton() {
  const questions = useQuestions();
  const subject = useSelectedSubject();
  const currentQuestion = useCurrentQuestion();

  const { nextQuestion } = usePracticeActions();

  const currentQuestionsData = useMemo(
    () => questions[subject] ?? [],
    [questions, subject]
  );

  const isLastQuestion =
    currentQuestionsData.length === 0 ||
    currentQuestion >= currentQuestionsData.length - 1;

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < currentQuestionsData.length - 1) {
      nextQuestion();
    }
  }, [currentQuestion, currentQuestionsData.length, nextQuestion]);

  useKey('n', handleNextQuestion, undefined, [handleNextQuestion]);

  return (
    <button
      aria-label="Next Question"
      type="button"
      onClick={handleNextQuestion}
      disabled={isLastQuestion}
      className="bg-accent-2 col-span-1 rounded-sm py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
    >
      Next
    </button>
  );
}
