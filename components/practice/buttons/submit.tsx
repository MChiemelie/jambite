'use client';

import { useCallback, useState } from 'react';
import { useKey } from 'react-use';
import { Results, UnattemptedSummary } from '@/components/practice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/dialog';
import {
  usePracticeActions,
  useSubmitPopup,
  useSubmitted,
  useTimeEnd
} from '@/stores/practice';

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

  useKey('s', openPopup, undefined, [openPopup]);
  useKey('e', openPopup, undefined, [openPopup]);
  useKey('y', handleConfirm, undefined, [handleConfirm]);
  useKey('n', handleCancel, undefined, [handleCancel]);

  const title = timeEnd
    ? 'Your time is up!'
    : submitted
      ? 'Practice Submitted Successfully!'
      : 'Confirm Submission';
  const description = submitted
    ? 'Congratulations! Your Practice has been submitted successfully.'
    : 'Are you sure you want to submit? Press Y to confirm or N to cancel.';

  return (
    <Dialog open={open} onOpenChange={setSubmitPopup}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={
            submitted
              ? 'View results'
              : 'End exam — open confirmation (Shortcut: S)'
          }
          className={`w-28 rounded p-2 ${submitted ? 'border-2 border-gray-300' : 'bg-red-800 text-white'}`}
        >
          {submitted ? 'Results' : 'End Exam'}
        </button>
      </DialogTrigger>

      <DialogContent className="mx-auto flex w-[90%] flex-col items-center gap-4 bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-800">
            {description}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="w-full rounded border border-red-400 bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {submitted ? <Results /> : <UnattemptedSummary />}

        {!submitted && (
          <div className="mt-4 flex w-full justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`w-24 rounded p-2 text-sm text-white sm:w-32 sm:text-base ${loading ? 'cursor-not-allowed bg-gray-400' : 'bg-accent-3'}`}
              onClick={submit}
              aria-label="Confirm submission (Shortcut: Y)"
            >
              {loading ? 'Submitting...' : 'Yes, Submit'}
            </button>

            <button
              type="button"
              disabled={loading}
              className="bg-accent-2 w-24 rounded p-2 text-sm text-white sm:w-32 sm:text-base"
              onClick={closePopup}
              aria-label="Cancel submission (Shortcut: N)"
            >
              Cancel
            </button>
          </div>
        )}

        {submitted && (
          <div className="flex justify-center text-sm sm:text-base">
            <button
              type="button"
              className="bg-accent-2 w-32 rounded p-2 text-white"
              onClick={closePopup}
            >
              Review
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
