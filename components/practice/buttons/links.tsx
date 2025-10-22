'use client';

import Link from 'next/link';
import { useSubmitted } from '@/stores/practice';

export default function Links() {
  const submitted = useSubmitted();

  return (
    <>
      {submitted && (
        <div className="flex w-full justify-evenly gap-3">
          <Link
            href="/dashboard"
            className="rounded border-2 border-gray-300 p-2 text-center text-sm lg:w-28"
          >
            Dashboard
          </Link>
          <Link
            href="/analytics"
            className="rounded border-2 border-gray-300 p-2 text-center text-sm lg:w-30"
          >
            Analytics
          </Link>
        </div>
      )}
    </>
  );
}
