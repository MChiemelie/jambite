'use client';

import { useUser } from '@/contexts';
import { useAIReviewStream } from '@/contexts/ai';
import {
  useAiReviews,
  useCurrentQuestion,
  usePracticeActions,
  useQuestions,
  useSelectedAnswers,
  useSelectedSubject,
  useSubmitted
} from '@/stores/practice';

export default function AIButton() {
  const submitted = useSubmitted();
  const { user } = useUser();
  const qIndex = useCurrentQuestion();
  const subject = useSelectedSubject();
  const qs = useQuestions()[subject] || [];
  const q = qs[qIndex];
  const selected =
    useSelectedAnswers()[q?.id] || '(The User did not select any answer)';
  const existing = useAiReviews()[subject]?.[q?.id] || '';
  const { submitNewMessage, loading } = useAIReviewStream();
  const { setPendingReview } = usePracticeActions();

  if (!submitted || !user?.ai || !q) {
    return null;
  }

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || existing) return;

    setPendingReview({ subject, questionId: q.id });

    submitNewMessage(
      `Question: ${q.question} Selected Answer: ${selected} Correct Answer: ${q.answer} Options: ${Object.entries(
        q.option || {}
      )
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')} Context: ${q.section}`
    );
  };

  return (
    <button
      onClick={handleClick}
      type="submit"
      disabled={!!existing || loading}
      className="bg-accent-4 col-span-2 rounded-sm py-1 text-sm text-white md:text-lg"
    >
      {existing
        ? 'AI Review Generated'
        : loading
          ? 'Generating…'
          : 'Generate AI Review'}
    </button>
  );
}
