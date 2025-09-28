'use client';

import { useCurrentQuestion, usePracticeActions } from '@/stores/practice';

export default function PreviousQuestionButton() {
  const currentQuestion = useCurrentQuestion();

  const { previousQuestion } = usePracticeActions();

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) previousQuestion();
  };

  return (
    <button aria-label="Previous Question Button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="col-span-1 bg-accent-2 text-white py-1 rounded-sm text-sm md:text-lg">
      Previous
    </button>
  );
}
