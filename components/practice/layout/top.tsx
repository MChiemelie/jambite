"use client";

import { ExamTimer, SubmitButton, Subjects, Links } from '@/components/practice';

export default function TopControls() {
  console.log("Topcontrols rendered")
  return (
    <div className="p-3 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
      <Subjects />
      <div className="flex items-center gap-3">
        <Links />
        <ExamTimer />
        <SubmitButton />
      </div>
    </div>
  );
}
