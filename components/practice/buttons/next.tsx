'use client';

import { useMemo } from 'react';
import { useCurrentQuestion, usePracticeActions, useQuestions, useSelectedSubject } from '@/stores/practice';

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
    <button aria-label="Next Question Button" onClick={handleNextQuestion} disabled={currentQuestion >= currentQuestionsData.length - 1} className="col-span-1 bg-accent-2 text-white rounded-sm  py-1 text-sm md:text-lg">
      Next
    </button>
  );
}
