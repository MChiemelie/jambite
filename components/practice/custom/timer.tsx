'use client';

import { Timer } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useCountdown, usePracticeActions, useSubmitted } from '@/stores/practice';

export default function ExamTimer() {
  const countdown = useCountdown();
  const submitted = useSubmitted();
  const { timeEnded, setCountdown } = usePracticeActions();

  // Use ref to track if timeEnded has been called to prevent double calls
  const timeEndedCalledRef = useRef(false);

  useEffect(() => {
    // Don't run timer if already submitted
    if (submitted) {
      return;
    }

    // Don't start timer if countdown is invalid
    if (typeof countdown !== 'number' || Number.isNaN(countdown) || countdown < 0) {
      return;
    }

    const timerId = setInterval(() => {
      setCountdown((prev) => {
        // Handle invalid previous value
        if (typeof prev !== 'number' || Number.isNaN(prev)) {
          return 0;
        }

        const newCountdown = prev - 1;

        // When countdown reaches 0, trigger auto-submission
        if (newCountdown <= 0 && !timeEndedCalledRef.current) {
          timeEndedCalledRef.current = true;

          // Clear the interval immediately
          clearInterval(timerId);

          // Call timeEnded asynchronously
          timeEnded().catch((error) => {
            console.error('Auto-submission failed:', error);
          });

          return 0;
        }

        return Math.max(0, newCountdown);
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [submitted, timeEnded, setCountdown, countdown]);

  // Handle invalid countdown values
  const validCountdown = typeof countdown === 'number' && !Number.isNaN(countdown) ? countdown : 0;
  const mm = String(Math.floor(validCountdown / 60)).padStart(2, '0');
  const ss = String(validCountdown % 60).padStart(2, '0');

  return (
    <div className='flex gap-2 items-center'>
      <Timer />
      <span className='bg-accent-2 p-2 w-[60px] text-center rounded-sm text-white'>
        {mm}:{ss}
      </span>
    </div>
  );
}
