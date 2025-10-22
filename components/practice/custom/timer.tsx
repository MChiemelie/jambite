'use client';

import { Timer } from 'lucide-react';
import { useEffect, useRef } from 'react';
import {
  useCountdown,
  usePracticeActions,
  useSubmitted
} from '@/stores/practice';

export default function ExamTimer() {
  const countdown = useCountdown();
  const submitted = useSubmitted();
  const { timeEnded, setCountdown } = usePracticeActions();
  const timeEndedCalledRef = useRef(false);

  useEffect(() => {
    if (submitted) {
      return;
    }

    if (
      typeof countdown !== 'number' ||
      Number.isNaN(countdown) ||
      countdown < 0
    ) {
      return;
    }

    const timerId = setInterval(() => {
      setCountdown((prev) => {
        if (typeof prev !== 'number' || Number.isNaN(prev)) {
          return 0;
        }
        const newCountdown = prev - 1;

        if (newCountdown <= 0 && !timeEndedCalledRef.current) {
          timeEndedCalledRef.current = true;

          clearInterval(timerId);

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
  const validCountdown =
    typeof countdown === 'number' && !Number.isNaN(countdown) ? countdown : 0;
  const mm = String(Math.floor(validCountdown / 60)).padStart(2, '0');
  const ss = String(validCountdown % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <Timer />
      <span className="bg-accent-2 w-[60px] rounded-sm p-2 text-center text-white">
        {mm}:{ss}
      </span>
    </div>
  );
}
