'use client';

import { AlertTriangle, BookOpen, CheckCircle, Clock, Download, Timer as TimerIcon, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Theme } from '@/components/themes';
import { useAwaitingCountdown, usePracticeActions } from '@/stores/practice';

function CountdownTimer({ initialSeconds = 1800, onEnd, frozen = false }: { initialSeconds?: number; onEnd?: () => void; frozen?: boolean }) {
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
      const message = "Hold on! Refreshing now will reset your exam preparation and you'll lose all progress. Please don't reload - stay on this page until your questions are ready.";
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
    if (typeof initialSeconds !== 'number' || Number.isNaN(initialSeconds) || initialSeconds <= 0) {
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
  const percent = Math.max(0, Math.min(100, Math.round((secondsLeft / initialSeconds) * 100)));

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center gap-2'>
        <TimerIcon className='w-4 h-4 text-amber-400' />
        <span className='font-mono text-sm'>
          {mm}:{ss}
        </span>
      </div>

      <div className='w-40 bg-foreground/6 h-0.5 overflow-hidden'>
        <div className='h-0.5 bg-amber-400' style={{ width: `${percent}%`, transition: 'width 250ms linear' }} />
      </div>

      <div className='text-xs text-foreground/30'>{percent}%</div>
    </div>
  );
}

export default function Awaiting({ estimatedSeconds, progress = 0, onCancel, onTimeEnd, onClose, ready = false }: { estimatedSeconds?: number; progress?: number; onCancel?: () => void; onTimeEnd?: () => void; onClose?: () => void; ready?: boolean }) {
  return (
    <div className='p-6'>
      <div className='flex gap-4 flex-col lg:flex-row items-center lg:items-start'>
        <div className='flex-none '>
          <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white'>
            <Clock className='w-8 h-8' />
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-8'>
          <div className='flex items-center lg:items-start justify-between flex-col lg:flex-row  gap-4'>
            <div>
              <h2 className='text-center lg:text-justify text-lg font-semibold'>{progress > 0 && progress < 100 ? 'Loading questions...' : ready ? 'Questions ready!' : 'Preparing your exam...'}</h2>
              <p className=' text-center lg:text-justify text-sm text-muted-foreground mt-1'>{ready ? "All set! Click 'Start Practice' when you're ready." : 'This might take a while, at most 3 minutes. Grab a quick read of the instructions and tips.'}</p>
            </div>

            <div className='flex flex-col lg:items-end items-center gap-2'>
              <Theme />
              <CountdownTimer initialSeconds={estimatedSeconds} onEnd={onTimeEnd} frozen={ready} />
              <div className='flex gap-2'>
                <button onClick={onCancel} type='button' className='text-sm px-3 py-1 rounded bg-transparent border border-white/8 hover:bg-white/3'>
                  Cancel
                </button>
                <button
                  onClick={() => ready && onClose?.()}
                  disabled={!ready}
                  type='button'
                  className={`text-sm px-3 py-1 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${ready ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-transparent border border-white/8'}`}
                >
                  {ready ? 'Start Practice' : 'Preparing...'}
                </button>
              </div>
            </div>
          </div>

          {progress > 0 && progress < 100 && (
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-3'>
                <Download className='w-4 h-4 text-blue-400 animate-bounce' />
                <span className='text-sm font-medium'>Loading Questions: {progress}%</span>
              </div>
              <div className='w-full bg-foreground/10 rounded h-0.5 overflow-hidden'>
                <div className='h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-900 ease-out' style={{ width: `${progress}%` }} />
              </div>
              <p className='text-xs text-foreground-400'>
                {progress < 20 && 'Connecting to server...'}
                {progress >= 20 && progress < 50 && 'Downloading questions...'}
                {progress >= 50 && progress < 70 && 'Almost there...'}
                {progress >= 70 && 'Waiting for server response...'}
              </p>
            </div>
          )}

          <div className='flex flex-wrap gap-2 items-center justify-center lg:justify-normal'>
            <div className='text-xs bg-white/6 px-3 py-1 rounded-full'>Network: {progress > 0 ? 'Downloading' : ready ? 'Ready' : 'Checking'}</div>
            {estimatedSeconds && <div className='text-xs bg-white/6 px-3 py-1 rounded-full'>Est. wait: {estimatedSeconds}s</div>}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <section className='p-3 bg-white/3 rounded flex flex-col gap-4'>
              <h3 className='flex items-center gap-2 text-sm font-medium'>
                <AlertTriangle className='w-4 h-4' /> Rules & Regulations
              </h3>
              <ul className='text-xs leading-snug list-disc list-inside text-foreground/90'>
                <li>Bring your ID and exam slip — no ID, no entry.</li>
                <li>Mobile phones turned off and stored away.</li>
                <li>No unauthorized materials: books, cheat sheets, or earphones.</li>
                <li>Follow invigilator instructions immediately.</li>
                <li>Any malpractice = immediate disqualification.</li>
              </ul>
            </section>

            <section className='p-3 bg-white/3 rounded'>
              <h3 className='flex items-center gap-2 text-sm font-medium'>
                <Zap className='w-4 h-4' /> Quick Success Tips
              </h3>
              <ol className='mt-2 text-xs leading-snug list-decimal list-inside text-foreground/90'>
                <li>Read instructions first — 30 seconds can save points.</li>
                <li>Answer easy questions first to secure marks fast.</li>
                <li>Manage time: set mini-benchmarks every 15—20 mins.</li>
                <li>If stuck, mark & move on — don't burn time.</li>
                <li>Review flagged questions in the last 10 minutes.</li>
              </ol>
            </section>

            <section className='p-3 bg-white/3 rounded sm:col-span-2'>
              <h3 className='flex items-center gap-2 text-sm font-medium'>
                <BookOpen className='w-4 h-4' /> What to Read While You Wait
              </h3>
              <div className='mt-2 text-xs text-foreground/90 space-y-2'>
                <p>Short reads to keep you sharp while the test loads:</p>
                <ul className='list-disc list-inside ml-3'>
                  <li>
                    <strong>Exam Format:</strong> skim subject breakdown and question types.
                  </li>
                  <li>
                    <strong>Marking Scheme:</strong> prioritise high-value questions.
                  </li>
                  <li>
                    <strong>Formula Sheet:</strong> quick scan of essential formulas or facts.
                  </li>
                  <li>
                    <strong>Mindset:</strong> 2—3 deep breaths, visualise finishing strong.
                  </li>
                </ul>
              </div>
            </section>

            <section className='p-3 bg-white/3 rounded sm:col-span-2 flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-semibold'>Final checklist</h4>
                <p className='text-xs text-foreground/80 mt-1'>Two-minute run-through before you start.</p>
                <ul className='mt-2 text-xs list-disc list-inside text-foreground/80'>
                  <li>Seat number visible</li>
                  <li>Calculator rules followed</li>
                  <li>All answers saved / ready to submit</li>
                </ul>
              </div>

              <div className='ml-4 flex flex-col items-end'>
                <div className='text-sm font-medium flex items-center gap-1'>
                  <CheckCircle className='w-5 h-5' /> {ready ? 'Ready to go' : 'Preparing...'}
                </div>
                <div className='text-xs mt-2'>Good luck — don't rush, but don't stall.</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
