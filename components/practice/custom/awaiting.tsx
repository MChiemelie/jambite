'use client';
import {
 AlertTriangle,
 BookOpen,
 CheckCircle,
 Clock,
 Timer as TimerIcon,
 Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function CountdownTimer({
 initialSeconds = 180,
 onEnd
}: {
 initialSeconds?: number;
 onEnd?: () => void;
}) {
 const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
 const endedRef = useRef(false);

 useEffect(() => {
  // guard: invalid input
  if (
   typeof initialSeconds !== 'number' ||
   Number.isNaN(initialSeconds) ||
   initialSeconds <= 0
  ) {
   setSecondsLeft(0);
   return;
  }

  setSecondsLeft(initialSeconds);
  endedRef.current = false;

  const id = setInterval(() => {
   setSecondsLeft((prev) => {
    if (prev <= 1) {
     if (!endedRef.current) {
      endedRef.current = true;
      // call onEnd but don't block UI
      if (onEnd) setTimeout(onEnd, 0);
     }
     clearInterval(id);
     return 0;
    }
    return prev - 1;
   });
  }, 1000);

  return () => clearInterval(id);
 }, [initialSeconds, onEnd]);

 const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
 const ss = String(secondsLeft % 60).padStart(2, '0');
 const percent = Math.max(
  0,
  Math.min(100, Math.round((secondsLeft / initialSeconds) * 100))
 );

 return (
  <div className='flex items-center gap-3'>
   <div className='flex items-center gap-2'>
    <TimerIcon className='w-4 h-4 text-amber-400' />
    <span className='font-mono text-sm'>
     {mm}:{ss}
    </span>
   </div>

   <div className='w-40 bg-white/6 rounded-full h-2 overflow-hidden'>
    <div
     className='h-2 rounded-full bg-amber-400'
     style={{ width: `${percent}%`, transition: 'width 250ms linear' }}
    />
   </div>

   <div className='text-xs text-slate-300'>{percent}%</div>
  </div>
 );
}

export default function Awaiting({
 estimatedSeconds,
 onCancel,
 onTimeEnd
}: {
 estimatedSeconds?: number;
 onCancel?: () => void;
 onTimeEnd?: () => void;
}) {
 return (
  <div className='w-full max-w-3xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/6 shadow-lg'>
   <div className='flex items-start gap-4'>
    <div className='flex-none'>
     <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center text-white'>
      <Clock className='w-8 h-8' />
     </div>
    </div>

    <div className='flex-1'>
     <div className='flex items-start gap-4'>
      <div>
       <h2 className='text-lg font-semibold'>Fetching your questions…</h2>
       <p className='text-sm text-muted-foreground mt-1'>
        Grab a quick read — this won’t take long. 3 minutes goes by faster than
        you think.
       </p>
      </div>

      <div className='ml-auto flex flex-col items-end gap-2'>
       <div className='text-xs text-slate-300'>Need to cancel?</div>
       <div className='flex items-center gap-3'>
        <CountdownTimer
         initialSeconds={estimatedSeconds ?? 180}
         onEnd={onTimeEnd}
        />
        <button
         type='button'
         onClick={onCancel}
         className='text-sm px-3 py-1 rounded bg-transparent border border-white/8 hover:bg-white/3'
        >
         Cancel
        </button>
       </div>
      </div>
     </div>

     <div className='mt-4 flex flex-wrap gap-2 items-center'>
      <div className='text-xs bg-white/6 px-3 py-1 rounded-full'>
       Network: Checking
      </div>
      {estimatedSeconds && (
       <div className='text-xs bg-white/6 px-3 py-1 rounded-full'>
        Est. wait: {estimatedSeconds}s
       </div>
      )}
     </div>

     <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3'>
      <section className='p-3 bg-white/3 rounded-lg'>
       <h3 className='flex items-center gap-2 text-sm font-medium'>
        <AlertTriangle className='w-4 h-4' /> Rules & Regulations
       </h3>
       <ul className='mt-2 text-xs leading-snug list-disc list-inside text-slate-200/90'>
        <li>Bring your ID and exam slip — no ID, no entry.</li>
        <li>Mobile phones turned off and stored away.</li>
        <li>No unauthorized materials: books, cheat sheets, or earphones.</li>
        <li>Follow invigilator instructions immediately.</li>
        <li>Any malpractice = immediate disqualification.</li>
       </ul>
      </section>

      <section className='p-3 bg-white/3 rounded-lg'>
       <h3 className='flex items-center gap-2 text-sm font-medium'>
        <Zap className='w-4 h-4' /> Quick Success Tips
       </h3>
       <ol className='mt-2 text-xs leading-snug list-decimal list-inside text-slate-200/90'>
        <li>Read instructions first — 30 seconds can save points.</li>
        <li>Answer easy questions first to secure marks fast.</li>
        <li>Manage time: set mini-benchmarks every 15–20 mins.</li>
        <li>If stuck, mark & move on — don’t burn time.</li>
        <li>Review flagged questions in the last 10 minutes.</li>
       </ol>
      </section>

      <section className='p-3 bg-white/3 rounded-lg sm:col-span-2'>
       <h3 className='flex items-center gap-2 text-sm font-medium'>
        <BookOpen className='w-4 h-4' /> What to Read While You Wait
       </h3>
       <div className='mt-2 text-xs text-slate-200/90 space-y-2'>
        <p>Short reads to keep you sharp while the test loads:</p>
        <ul className='list-disc list-inside ml-3'>
         <li>
          <strong>Exam Format:</strong> skim subject breakdown and question
          types.
         </li>
         <li>
          <strong>Marking Scheme:</strong> prioritise high-value questions.
         </li>
         <li>
          <strong>Formula Sheet:</strong> quick scan of essential formulas or
          facts.
         </li>
         <li>
          <strong>Mindset:</strong> 2–3 deep breaths, visualise finishing
          strong.
         </li>
        </ul>
       </div>
      </section>

      <section className='p-3 bg-white/3 rounded-lg sm:col-span-2 flex items-center justify-between'>
       <div>
        <h4 className='text-sm font-semibold'>Final checklist</h4>
        <p className='text-xs text-slate-200/80 mt-1'>
         Two-minute run-through before you start.
        </p>
        <ul className='mt-2 text-xs list-disc list-inside text-slate-200/80'>
         <li>Seat number visible</li>
         <li>Calculator rules followed</li>
         <li>All answers saved / ready to submit</li>
        </ul>
       </div>

       <div className='ml-4 flex flex-col items-end'>
        <div className='text-sm font-medium flex items-center gap-1'>
         <CheckCircle className='w-5 h-5' /> Ready to go
        </div>
        <div className='text-xs mt-2'>
         Good luck — don’t rush, but don’t stall.
        </div>
       </div>
      </section>
     </div>
    </div>
   </div>
  </div>
 );
}
