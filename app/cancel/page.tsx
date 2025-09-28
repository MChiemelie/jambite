import { Status } from '@/components/custom';
import { redirect } from 'next/navigation';

export default async function CancelPage() {
  redirect('/payments');

  return <Status image="/assets/cancel.svg" desc1="You cancelled the payment" desc2="Redirecting..." />;
}
