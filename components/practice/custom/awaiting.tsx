'use client';

import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Timer as TimerIcon,
  Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Theme } from '@/components/themes';
import { useAwaitingCountdown, usePracticeActions } from '@/stores/practice';

function CountdownTimer({
  initialSeconds = 1800,
  onEnd,
  frozen = false
}: {
  initialSeconds?: number;
  onEnd?: () => void;
  frozen?: boolean;
}) {
  const storedCountdown = useAwaitingCountdown();
  const { setAwaitingCountdown } = usePracticeActions();
  const initialValue = storedCountdown > 0 ? storedCountdown : initialSeconds;
  const [secondsLeft, setSecondsLeft] = useState<number>(initialValue);
  const endedRef = useRef(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    // Warn user about refreshing/closing the page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers will show their own message, but we set this for older browsers
      const message =
        "Hold on! Refreshing now will reset your exam preparation and you'll lose all progress. Please don't reload - stay on this page until your questions are ready.";
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Sync local state to store in a separate effect to avoid setState during render
  useEffect(() => {
    if (isMountedRef.current && !frozen) {
      setAwaitingCountdown(secondsLeft);
    }
  }, [secondsLeft, frozen, setAwaitingCountdown]);

  // Handle frozen state separately - stop countdown but don't reset to 0
  useEffect(() => {
    if (frozen && isMountedRef.current) {
      // Save the current countdown value when frozen
      setAwaitingCountdown(secondsLeft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen, setAwaitingCountdown]);

  useEffect(() => {
    if (
      typeof initialSeconds !== 'number' ||
      Number.isNaN(initialSeconds) ||
      initialSeconds <= 0
    ) {
      setSecondsLeft(0);
      return;
    }

    endedRef.current = false;

    if (frozen) {
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        const newValue = prev <= 1 ? 0 : prev - 1;

        if (newValue === 0 && !endedRef.current) {
          endedRef.current = true;
          if (onEnd) {
            onEnd();
          }
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [frozen, onEnd, initialSeconds]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const percent = Math.max(
    0,
    Math.min(100, Math.round((secondsLeft / initialSeconds) * 100))
  );

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <TimerIcon className="h-4 w-4 text-amber-400" />
        <span className="font-mono text-sm">
          {mm}:{ss}
        </span>
      </div>

      <div className="bg-foreground/6 h-0.5 w-40 overflow-hidden">
        <div
          className="h-0.5 bg-amber-400"
          style={{ width: `${percent}%`, transition: 'width 250ms linear' }}
        />
      </div>

      <div className="text-foreground/30 text-xs">{percent}%</div>
    </div>
  );
}

export default function Awaiting({
  estimatedSeconds,
  progress = 0,
  onCancel,
  onTimeEnd,
  onClose,
  ready = false
}: {
  estimatedSeconds?: number;
  progress?: number;
  onCancel?: () => void;
  onTimeEnd?: () => void;
  onClose?: () => void;
  ready?: boolean;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
        <div className="flex-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white">
            <Clock className="h-8 w-8" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <h2 className="text-center text-lg font-semibold lg:text-justify">
                {progress > 0 && progress < 100
                  ? 'Loading questions...'
                  : ready
                    ? 'Questions ready!'
                    : 'Preparing your exam...'}
              </h2>
              <p className="text-muted-foreground mt-1 text-center text-sm lg:text-justify">
                {ready
                  ? "All set! Click 'Start Practice' when you're ready."
                  : 'This might take a while, at most 3 minutes. Grab a quick read of the instructions and tips.'}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 lg:items-end">
              <Theme />
              <CountdownTimer
                initialSeconds={estimatedSeconds}
                onEnd={onTimeEnd}
                frozen={ready}
              />
              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  type="button"
                  className="rounded border border-white/8 bg-transparent px-3 py-1 text-sm hover:bg-white/3"
                >
                  Cancel
                </button>
                <button
                  onClick={() => ready && onClose?.()}
                  disabled={!ready}
                  type="button"
                  className={`rounded px-3 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${ready ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'border border-white/8 bg-transparent'}`}
                >
                  {ready ? 'Start Practice' : 'Preparing...'}
                </button>
              </div>
            </div>
          </div>

          {progress > 0 && progress < 100 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Download className="h-4 w-4 animate-bounce text-blue-400" />
                <span className="text-sm font-medium">
                  Loading Questions: {progress}%
                </span>
              </div>
              <div className="bg-foreground/10 h-0.5 w-full overflow-hidden rounded">
                <div
                  className="h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-900 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-foreground-400 text-xs">
                {progress < 20 && 'Connecting to server...'}
                {progress >= 20 && progress < 50 && 'Downloading questions...'}
                {progress >= 50 && progress < 70 && 'Almost there...'}
                {progress >= 70 && 'Waiting for server response...'}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-normal">
            <div className="rounded-full bg-white/6 px-3 py-1 text-xs">
              Network:{' '}
              {progress > 0 ? 'Downloading' : ready ? 'Ready' : 'Checking'}
            </div>
            {estimatedSeconds && (
              <div className="rounded-full bg-white/6 px-3 py-1 text-xs">
                Est. wait: {estimatedSeconds}s
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <section className="flex flex-col gap-4 rounded bg-white/3 p-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" /> Rules & Regulations
              </h3>
              <ul className="text-foreground/90 list-inside list-disc text-xs leading-snug">
                <li>Bring your ID and exam slip — no ID, no entry.</li>
                <li>Mobile phones turned off and stored away.</li>
                <li>
                  No unauthorized materials: books, cheat sheets, or earphones.
                </li>
                <li>Follow invigilator instructions immediately.</li>
                <li>Any malpractice = immediate disqualification.</li>
              </ul>
            </section>

            <section className="rounded bg-white/3 p-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4" /> Quick Success Tips
              </h3>
              <ol className="text-foreground/90 mt-2 list-inside list-decimal text-xs leading-snug">
                <li>Read instructions first — 30 seconds can save points.</li>
                <li>Answer easy questions first to secure marks fast.</li>
                <li>Manage time: set mini-benchmarks every 15—20 mins.</li>
                <li>If stuck, mark & move on — don't burn time.</li>
                <li>Review flagged questions in the last 10 minutes.</li>
              </ol>
            </section>

            <section className="rounded bg-white/3 p-3 sm:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4" /> What to Read While You Wait
              </h3>
              <div className="text-foreground/90 mt-2 space-y-2 text-xs">
                <p>Short reads to keep you sharp while the test loads:</p>
                <ul className="ml-3 list-inside list-disc">
                  <li>
                    <strong>Exam Format:</strong> skim subject breakdown and
                    question types.
                  </li>
                  <li>
                    <strong>Marking Scheme:</strong> prioritise high-value
                    questions.
                  </li>
                  <li>
                    <strong>Formula Sheet:</strong> quick scan of essential
                    formulas or facts.
                  </li>
                  <li>
                    <strong>Mindset:</strong> 2—3 deep breaths, visualise
                    finishing strong.
                  </li>
                </ul>
              </div>
            </section>

            <section className="flex items-center justify-between rounded bg-white/3 p-3 sm:col-span-2">
              <div>
                <h4 className="text-sm font-semibold">Final checklist</h4>
                <p className="text-foreground/80 mt-1 text-xs">
                  Two-minute run-through before you start.
                </p>
                <ul className="text-foreground/80 mt-2 list-inside list-disc text-xs">
                  <li>Seat number visible</li>
                  <li>Calculator rules followed</li>
                  <li>All answers saved / ready to submit</li>
                </ul>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <CheckCircle className="h-5 w-5" />{' '}
                  {ready ? 'Ready to go' : 'Preparing...'}
                </div>
                <div className="mt-2 text-xs">
                  Good luck — don't rush, but don't stall.
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
