'use client';

import {
  ExamTimer,
  Links,
  Subjects,
  SubmitButton
} from '@/components/practice';

export default function TopControls() {
  return (
    <nav className="flex flex-col items-center justify-between gap-4 p-3 text-sm md:flex-row">
      <Subjects />
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Links />
        <div className="flex items-center gap-3">
          <ExamTimer />
          <SubmitButton />
        </div>
      </div>
    </nav>
  );
}
