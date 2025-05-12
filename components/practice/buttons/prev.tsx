'use client';

import { useCurrentQuestion, usePracticeActions } from '@/stores/practice';

export default function PreviousQuestionButton() {
  const currentQuestion = useCurrentQuestion();

  const { previousQuestion } = usePracticeActions();

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) previousQuestion();
  };

  return (
    <button aria-label="Previous Question Button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="bg-accent-2 text-white py-1 px-3 rounded-sm w-28">
      Previous
    </button>
  );
}
