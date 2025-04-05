'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Status } from '@/components/custom';
import { incrementTrials, verifyPayment } from '@/services/payments';

export default function VerifyPage() {
  const [status, setStatus] = useState('verifying');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const reference = searchParams.get('reference');

      if (!reference) {
        setStatus('failed');
        return;
      }

      try {
        const response = await verifyPayment(reference);
        if (response.status) {
          setStatus('success');
          await incrementTrials(response.data);
          router.push('/payments');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('failed');
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div>
      {status === 'verifying' && <Status image="/assets/verify.svg" desc1="We're verifying your payment" desc2="Please hold on..." />}
      {status === 'success' && <Status image="/assets/confirm.svg" desc1="Your payment verification was successfull!" desc2="Updating your trails and redirecting.." />}
      {status === 'failed' && <Status image="/assets/failed.svg" desc1="Your payment verification was unsuccessfull!" desc2="If you think this is in error, contact the developer - melikamchukwuemelie@gmail.com." />}
    </div>
  );
}
