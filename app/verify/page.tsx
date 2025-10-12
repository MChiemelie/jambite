'use client';

import { Suspense } from 'react';
import { Status } from '@/components/custom';
import { Verify } from '@/components/payments';

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <Status
          image='/assets/verify.svg'
          desc1="We're verifying your payment."
          desc2='Please hold on.'
        />
      }
    >
      <Verify />
    </Suspense>
  );
}
