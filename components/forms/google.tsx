'use server';

import Image from 'next/image';
import { signUpWithGoogle } from '@/services';

export default async function GoogleAuth() {
  return (
    <form action={signUpWithGoogle}>
      <button type='submit' className='border-foreground/20 mx-auto flex w-full items-center justify-center gap-2 rounded-lg border p-2 shadow-lg'>
        <Image src='/images/socials/google.png' alt='Login with Google Button' width={24} height={24} className='w-6' />
        <span className='text-sm font-medium'>Google</span>
      </button>
    </form>
  );
}
