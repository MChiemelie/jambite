import { Timer } from 'lucide-react';
import React, { useEffect, memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCountdown } from '@/store/practiceSlice';

interface TimerProps {
  initialCountdown: number;
  onTimeEnd: () => void;
  submitted: boolean;
}

const ExamTimer: React.FC<TimerProps> = ({ initialCountdown, onTimeEnd, submitted }) => {
  const [newCountdown, setNewCountdown] = useState(initialCountdown);
  const dispatch = useDispatch();

  useEffect(() => {
    if (submitted) {
      dispatch(setCountdown(newCountdown));
      return;
    }

    if (newCountdown <= 0) {
      onTimeEnd();
      return;
    }

    const timer = setInterval(() => {
      setNewCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [newCountdown, onTimeEnd, submitted, dispatch]);

  const minutes = Math.floor(newCountdown / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (newCountdown % 60).toString().padStart(2, '0');

  return (
    <div className="flex space-x-2 items-center">
      <Timer />
      <span className="bg-accent-2 p-2 w-[60px] text-center rounded-sm">
        {minutes}:{seconds}
      </span>
    </div>
  );
};

ExamTimer.displayName = 'ExamTimer';

export default memo(ExamTimer);
