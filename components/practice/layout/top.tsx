'use client';

import {
  ExamTimer,
  Links,
  Subjects,
  SubmitButton
} from '@/components/practice';

export default function TopControls() {
  return (
    <nav className='p-3 flex flex-col md:flex-row gap-4 items-center justify-between text-sm'>
      <Subjects />
      <div className='flex flex-col sm:flex-row items-center gap-3'>
        <Links />
        <div className='flex items-center gap-3'>
          <ExamTimer />
          <SubmitButton />
        </div>
      </div>
    </nav>
  );
}
