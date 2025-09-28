'use client';

import { useEffect } from 'react';
import { useCountdown, usePracticeActions, useSubmitted } from '@/stores/practice';
import { Timer } from 'lucide-react';

export default function ExamTimer() {
  const countdown = useCountdown();
  const submitted = useSubmitted();
  const { timeEnded, setCountdown } = usePracticeActions();

  useEffect(() => {
    if (submitted) {
      return;
    }

    const timerId = setInterval(() => {
      if (countdown <= 1) {
        clearInterval(timerId);
        timeEnded();
        setCountdown(0);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [countdown, submitted, timeEnded, setCountdown]);

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <div className="flex gap-2 items-center">
      <Timer />
      <span className="bg-accent-2 p-2 w-[60px] text-center rounded-sm text-white">
        {mm}:{ss}
      </span>
    </div>
  );
}
