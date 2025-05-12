'use client';

import { useMemo } from 'react';
import { useAIChatStream } from 'next-ai-stream/client';
import { useSubmitted, useUser, useQuestions, useSelectedAnswers, useSelectedSubject, useCurrentQuestion, useAiReviews, usePracticeActions } from '@/stores/practice';

export default function AIButton() {
  const submitted = useSubmitted();
  const user = useUser();
  if (!submitted || !user?.ai) return null;

  const subject = useSelectedSubject();
  const qIndex = useCurrentQuestion();
  const qs = useQuestions()[subject] || [];
  const q = qs[qIndex];
  const selected = useSelectedAnswers()[q.id] || '';
  const existing = useAiReviews()[subject]?.[q.id] || '';

  const { messages, submitNewMessage, loading } = useAIChatStream({
    apiEndpoint: '/api/ai',
    systemPrompt: 'You are a world class teacher helping Nigerian senior and post-secondary students to review JAMB, SSCE, and NECO exam past questions. Explain why their answer is right or wrong in two sentences, under 200 characters. Be friendly, simple, informative, expository, analytical and direct. No emojis.',
  });

  const { setPendingReview } = usePracticeActions();

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || existing) return;
    setPendingReview({ subject, questionId: q.id });
    submitNewMessage(
      `Question: ${q.question} Selected Answer: ${selected} Correct Answer: ${q.answer} Options: ${Object.entries(q.option || {}).map(([k, v]) => `${k}: ${v}`).join(', ')} Context: ${q.section}`
    );
    console.log(messages)
  };

  return (
    <button onClick={handleClick} disabled={!!existing || loading} className="bg-accent-4 text-white py-1 px-3 rounded w-fit">
      {existing ? 'AI Review Generated' : loading ? 'Generating…' : 'Generate AI Review'}
    </button>
  );
}
