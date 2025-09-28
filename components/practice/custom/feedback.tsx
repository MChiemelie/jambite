'use client';

import { useCurrentQuestion, useHasHydrated, useQuestions, useResultsFeedback, useSelectedSubject, useSubmitted } from '@/stores/practice';
import { Question } from '@/types';
import parse from 'html-react-parser';
import { Check, ThumbsUp, X } from 'lucide-react';

const renderFeedbackMessage = (fb: { type: string; userAnswer?: string; correctAnswer: string }) => {
  switch (fb.type) {
    case 'correct':
      return (
        <p className="text-md md:text-lg">
          You are Correct! <ThumbsUp className="inline w-4 h-4" /> The answer is {fb.correctAnswer} <Check className="inline w-4 h-4 text-green-600" />.
        </p>
      );
    case 'incorrect':
      return (
        <p className="text-md md:text-lg">
          <X className="inline w-4 h-4 text-red-600" /> {fb.userAnswer} is incorrect. The correct answer is {fb.correctAnswer} <Check className="inline w-4 h-4 text-green-600" />.
        </p>
      );
    case 'unattempted':
      return (
        <p className="text-md md:text-lg">
          You didn't attempt this question <X className="inline w-4 h-4 text-red-600" />. The correct answer is {fb.correctAnswer} <Check className="inline w-4 h-4 text-green-600" />.
        </p>
      );
    default:
      return null;
  }
};

export default function Feedback() {
  const hasHydrated = useHasHydrated();
  const submitted = useSubmitted();
  const currentQ = useCurrentQuestion();
  const feedbackMap = useResultsFeedback();
  const questions = useQuestions();
  const selectedSub = useSelectedSubject();

  if (!hasHydrated) return null;

  const currentQuestionsData = questions[selectedSub] ?? [];
  const currentQuestionData = currentQuestionsData[currentQ] as Question | undefined;
  const currentQuestionId = currentQuestionData?.id;

  const fb = currentQuestionId != null ? feedbackMap[currentQuestionId] : undefined;

  if (!submitted || !fb) return null;

  return (
    <div className="flex flex-col gap-4">
      {renderFeedbackMessage(fb)}
      {currentQuestionData?.solution && <p className="md:text-lg">Solution: {parse(currentQuestionData.solution)}</p>}
    </div>
  );
}
