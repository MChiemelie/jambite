'use client';

import { createContext, ReactNode } from 'react';
import { useAIChatStream } from 'next-ai-stream/client';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

interface AIContextValue {
  messages: { role: string; content: string }[];
  loading: boolean;
  submitNewMessage: (msg: string) => void;
}

export const AIContext = createContext<AIContextValue | null>(null);

export default function AIReview({ children }: { children: ReactNode }) {
  const {
    messages: rawMessages,
    loading,
    submitNewMessage,
  } = useAIChatStream({
    apiEndpoint: '/api/ai',
    systemPrompt: 'You are a world class teacher helping Nigerian senior and post-secondary students to review JAMB, SSCE, and NECO exam past questions. Explain why their answer is right or wrong in two sentences, under 200 characters. Be friendly, simple, informative, expository, analytical and direct. No emojis.',
  });

  const messages = (rawMessages || []).map((msg: ChatCompletionMessageParam) => {
    let contentStr = '';
    if (typeof msg.content === 'string') {
      contentStr = msg.content;
    } else if (Array.isArray(msg.content)) {
      contentStr = msg.content.map((part) => (typeof part === 'string' ? part : 'text' in part && part.text ? part.text : '')).join('');
    }
    return { role: msg.role, content: contentStr };
  });

  return <AIContext.Provider value={{ messages, loading, submitNewMessage }}>{children}</AIContext.Provider>;
}
