'use client';

import { useCurrentQuestion, usePracticeActions, useQuestions, useSelectedSubject } from '@/stores/practice';
import { useMemo } from 'react';

export default function NextQuestionButton() {
  const questions = useQuestions();
  const subject = useSelectedSubject();
  const currentQuestion = useCurrentQuestion();

  const { nextQuestion } = usePracticeActions();

  const currentQuestionsData = useMemo(() => questions[subject] ?? [], [questions, subject]);

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuestionsData.length - 1) nextQuestion();
  };

  return (
    <button aria-label="Next Question Button" onClick={handleNextQuestion} disabled={currentQuestion >= currentQuestionsData.length - 1} className="bg-accent-2 text-white py-1 px-3 rounded-sm w-28">
      Next
    </button>
  );
}
