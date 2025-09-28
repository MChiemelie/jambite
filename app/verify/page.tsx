'use client';

import { Suspense } from 'react';
import { Verify } from '@/components/payments';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <Verify />
    </Suspense>
  );
}
