'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Status } from '@/components/custom';
import { getUserData, verifyPayment } from '@/services';
import type { User } from '@/types';

export default function Verify() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>(
    'verifying'
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const reference =
        searchParams.get('reference') || searchParams.get('trxref');
      const user = (await getUserData()) as User;
      const userId = user?.userId;

      if (!reference || !userId) {
        setStatus('failed');
        return;
      }

      try {
        const data = await verifyPayment(reference, userId);

        if (data.success) {
          setStatus('success');
          setTimeout(() => router.replace('/payments'), 1500);
        } else {
          setStatus('failed');
        }
      } catch {
        setStatus('failed');
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div>
      {status === 'verifying' && (
        <Status
          image='/assets/verify.svg'
          desc1="We're verifying your payment."
          desc2='Please hold on.'
        />
      )}
      {status === 'success' && (
        <Status
          image='/assets/confirm.svg'
          desc1='Payment verified!'
          desc2='Redirecting...'
        />
      )}
      {status === 'failed' && (
        <Status
          image='/assets/failed.svg'
          desc1='Verification failed'
          desc2='Contact support if you think this is wrong.'
        />
      )}
    </div>
  );
}
