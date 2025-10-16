import { redirect } from 'next/navigation';
import { Status } from '@/components/custom';

export default function NotFound() {
  redirect('/');

  return <Status image='/assets/not-found.svg' desc1='This page does not exist' desc2='Redirecting...' />;
}
