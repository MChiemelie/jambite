import React, { useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import { ExamTimerProps } from '@/types';

export default function ExamTimer({ onTimeEnd, submitted }: ExamTimerProps) {
  const examDuration = 1200;
  const [localCountdown, setLocalCountdown] = useState(examDuration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (submitted || localCountdown <= 0) return;

    timerRef.current = setInterval(() => {
      setLocalCountdown((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timerRef.current!);
        onTimeEnd();
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [submitted, onTimeEnd, localCountdown]);

  const minutes = Math.floor(localCountdown / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (localCountdown % 60).toString().padStart(2, '0');

  return (
    <div className="flex gap-2 items-center">
      <Timer />
      <span className="bg-accent-2 p-2 w-[60px] text-center rounded-sm text-white">
        {minutes}:{seconds}
      </span>
    </div>
  );
}
