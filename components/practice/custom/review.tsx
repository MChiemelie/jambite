'use client';

import { LoadingDots } from '@/components/custom';
import { Bot } from 'lucide-react';
import { useEffect } from 'react';
import { useAIChatStream } from 'next-ai-stream/client';
import { useQuestions, useSelectedSubject, useCurrentQuestion, useAiReviews, usePendingReview, usePracticeActions } from '@/stores/practice';

export default function AIReview() {
  const subject = useSelectedSubject();
  const qIndex = useCurrentQuestion();
  const qs = useQuestions()[subject] || [];
  const qId = qs[qIndex]?.id!;
  const existing = useAiReviews()[subject]?.[qId] || '';
  const pending = usePendingReview();

  const { messages, loading } = useAIChatStream({
    apiEndpoint: '/api/ai',
    systemPrompt: 'You are a world class teacher helping Nigerian senior and post-secondary students to review JAMB, SSCE, and NECO exam past questions. Explain why their answer is right or wrong in two sentences, under 200 characters. Be friendly, simple, informative, expository, analytical and direct. No emojis.',
  });

  const { setAiReview, setPendingReview } = usePracticeActions();

  useEffect(() => {
    console.log("AIreview rendered!")
    if (!loading && pending?.questionId === qId && messages.length) {
      const last = messages.at(-1);
      if (last?.role === 'assistant') {
        setAiReview({ subject, questionId: qId, review: last.content as string });
        setPendingReview(null);
      }
    }
  }, [messages, loading, pending, qId, subject, setAiReview, setPendingReview]);

  if (loading)
    return (
      <div className="flex items-center gap-2 p-4 glow-animation">
        <Bot className="h-12 w-12" />
        <p>Erudite is thinking…</p>
        <LoadingDots />
      </div>
    );

  return (
    existing && (
      <div className="mt-4 flex items-start gap-2 p-4 bg-gray-50 rounded">
        <Bot className="h-12 w-12" />
        <p className="text-sm md:text-lg">{existing}</p>
      </div>
    )
  );
}
