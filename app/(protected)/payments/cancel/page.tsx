'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Status } from '@/components/custom';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/payments');
  }, [router]);

  return <Status image="/assets/cancel.svg" desc1="You cancelled the payment" desc2="Redirecting..." />;
}
