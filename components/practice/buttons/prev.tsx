'use client';

import { useKey } from 'react-use';
import { useCurrentQuestion, usePracticeActions } from '@/stores/practice';

export default function PreviousQuestionButton() {
  const currentQuestion = useCurrentQuestion();

  const { previousQuestion } = usePracticeActions();

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) previousQuestion();
  };

  useKey('p', handlePreviousQuestion, undefined, [currentQuestion]);

  return (
    <button
      aria-label="Previous Question Button"
      type="button"
      onClick={handlePreviousQuestion}
      disabled={currentQuestion === 0}
      className="bg-accent-2 col-span-1 rounded-sm py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
    >
      Previous
    </button>
  );
}
