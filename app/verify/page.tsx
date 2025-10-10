'use client';

import { Suspense } from 'react';
import { Verify } from '@/components/payments';
import { Status } from '@/components/custom';

export default function VerifyPage() {
  return (
    <Suspense fallback={<Status image="/assets/verify.svg" desc1="We're verifying your payment." desc2="Please hold on." />}>
      <Verify />
    </Suspense>
  );
}
