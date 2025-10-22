'use client';

import { AIReview, Hydration } from '@/providers';

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Hydration>
      <AIReview>{children}</AIReview>
    </Hydration>
  );
}
