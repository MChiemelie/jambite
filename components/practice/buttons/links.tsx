'use client';

import Link from 'next/link';
import { useSubmitted } from '@/stores/practice';

export default function Links() {
  const submitted = useSubmitted();

  return (
    <>
      {submitted && (
        <div className='flex gap-3 justify-evenly w-full'>
          <Link
            href='/dashboard'
            className='lg:w-28 text-sm text-center border-2 border-gray-300 rounded p-2'
          >
            Dashboard
          </Link>
          <Link
            href='/analytics'
            className='lg:w-30 text-sm text-center border-2 border-gray-300 rounded p-2'
          >
            Analytics
          </Link>
        </div>
      )}
    </>
  );
}
