'use client';

import { useEffect, useState } from 'react';
import { usePracticeStore } from '@/stores/practice';

export default function Hydration({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    usePracticeStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return <>{children}</>;
}
