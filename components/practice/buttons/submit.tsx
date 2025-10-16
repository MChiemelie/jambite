'use client';

import { useCallback, useState } from 'react';
import { useKey } from 'react-use';
import { Results, UnattemptedSummary } from '@/components/practice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { usePracticeActions, useSubmitPopup, useSubmitted, useTimeEnd } from '@/stores/practice';

export default function SubmitButton() {
  const submitted = useSubmitted();
  const timeEnd = useTimeEnd();
  const open = useSubmitPopup();
  const { setSubmitPopup, submitPractice } = usePracticeActions();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await submitPractice();
    } catch (err) {
      setError('Failed to submit practice. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  }, [submitPractice]);

  const openPopup = useCallback(() => {
    if (!submitted) {
      setSubmitPopup(true);
    }
  }, [setSubmitPopup, submitted]);

  const closePopup = useCallback(() => {
    setSubmitPopup(false);
  }, [setSubmitPopup]);

  const handleConfirm = useCallback(() => {
    if (open && !submitted) {
      submit();
    }
  }, [open, submitted, submit]);

  const handleCancel = useCallback(() => {
    if (open && !submitted) {
      closePopup();
    }
  }, [open, submitted, closePopup]);

  // Keyboard shortcuts
  // 's' or 'e' to open submit dialog (only when not already submitted)
  useKey('s', openPopup, undefined, [openPopup]);
  useKey('e', openPopup, undefined, [openPopup]);

  // 'y' to confirm submission (only when dialog is open and not submitted)
  useKey('y', handleConfirm, undefined, [handleConfirm]);

  // 'n' or 'Escape' to cancel (only when dialog is open and not submitted)
  useKey('n', handleCancel, undefined, [handleCancel]);

  const title = timeEnd ? 'Your time is up!' : submitted ? 'Practice Submitted Successfully!' : 'Confirm Submission';
  const description = submitted ? 'Congratulations! Your Practice has been submitted successfully.' : 'Are you sure you want to submit? Press Y to confirm or N to cancel.';

  return (
    <Dialog open={open} onOpenChange={setSubmitPopup}>
      <DialogTrigger asChild>
        <button type='button' aria-label={submitted ? 'View results' : 'End exam — open confirmation (Shortcut: S)'} className={`p-2 w-28 rounded ${submitted ? 'border-2 border-gray-300' : 'bg-red-800 text-white'}`}>
          {submitted ? 'Results' : 'End Exam'}
        </button>
      </DialogTrigger>

      <DialogContent className='bg-white text-black flex flex-col gap-4 w-[90%] mx-auto items-center'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold'>{title}</DialogTitle>
          <DialogDescription className='text-center text-gray-800'>{description}</DialogDescription>
        </DialogHeader>

        {error && <div className='w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

        {submitted ? <Results /> : <UnattemptedSummary />}

        {!submitted && (
          <div className='mt-4 flex w-full justify-between'>
            <button type='submit' disabled={loading} className={`text-sm sm:text-base p-2 rounded w-24 sm:w-32 text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-3'}`} onClick={submit} aria-label='Confirm submission (Shortcut: Y)'>
              {loading ? 'Submitting...' : 'Yes, Submit'}
            </button>

            <button type='button' disabled={loading} className='text-sm sm:text-base p-2 bg-accent-2 rounded w-24 sm:w-32 text-white' onClick={closePopup} aria-label='Cancel submission (Shortcut: N)'>
              Cancel
            </button>
          </div>
        )}

        {submitted && (
          <div className='flex justify-center text-sm sm:text-base'>
            <button type='button' className='p-2 rounded w-32 bg-accent-2 text-white' onClick={closePopup}>
              Review
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
