'use client';

import { useEffect } from 'react';
import { LoadingDots } from '@/components/custom';
import { useAIReviewStream } from '@/contexts/ai';
import { useAiReviews, useCurrentQuestion, usePendingReview, usePracticeActions, useQuestions, useSelectedSubject } from '@/stores/practice';
import { Bot } from 'lucide-react';

export default function AIReview() {
  const subject = useSelectedSubject();
  const qIndex = useCurrentQuestion();
  const qId = useQuestions()[subject]?.[qIndex]?.id!;
  const existing = useAiReviews()[subject]?.[qId] || '';
  const pending = usePendingReview();
  const { messages, loading } = useAIReviewStream();
  const { setAiReview, setPendingReview } = usePracticeActions();

  useEffect(() => {
    if (!loading && pending?.questionId === qId && messages.length) {
      const last = messages.at(-1);
      if (last?.role === 'assistant') {
        setAiReview({ subject, questionId: qId, review: last.content });
        setPendingReview(null);
      }
    }
  }, [messages, loading, pending, qId, subject, setAiReview, setPendingReview]);

  if (loading){
    return (
      <div className="flex bg-gray-200 border-2 border-gray-300 gap-2 p-4 rounded glow-animation">
        <Bot className="h-auto max-w-8" />
        <div className="flex items-center">
          <p className="md:text-lg">Erudite is thinking</p>
          <LoadingDots />
        </div>
      </div>
    )
  };

  return (
    existing && (
      <div className="flex items-start bg-gray-200 border-2 border-gray-300 gap-2 p-4 rounded">
        <Bot className="h-auto min-w-8" />
        <p className="md:text-lg">{existing}</p>
      </div>
    )
  );
}
