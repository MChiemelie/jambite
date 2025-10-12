'use client';

import { useContext } from 'react';
import { AIContext } from '@/providers/ai';

export function useAIReviewStream() {
  const ctx = useContext(AIContext);
  if (!ctx)
    throw new Error('useAIReviewStream must be inside AIReviewProvider');
  return ctx;
}
