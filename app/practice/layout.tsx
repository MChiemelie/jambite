'use client';

import { Hydration } from '@/providers';

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return <Hydration>{children}</Hydration>;
}
