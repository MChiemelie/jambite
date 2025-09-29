import { Status } from '@/components/custom';
import { redirect } from 'next/navigation';

export default function NotFound() {
  redirect('/');

  return <Status image="/assets/not-found.svg" desc1="This page does not exist" desc2="Redirecting..." />;
}
