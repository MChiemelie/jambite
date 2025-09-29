'use client';

import { useState } from 'react';
import { Results, UnattemptedSummary } from '@/components/practice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { usePracticeActions, useSubmitPopup, useSubmitted, useTimeEnd } from '@/stores/practice';

export default function SubmitButton() {
  const submitted = useSubmitted();
  const timeEnd = useTimeEnd();
  const open = useSubmitPopup();
  const { setSubmitPopup, submitPractice } = usePracticeActions();

  const [loading, setLoading] = useState(false);

  const title = timeEnd ? 'Your time is up!' : submitted ? 'Practice Submitted Successfully!' : 'Confirm Submission';
  const description = submitted ? 'Congratulations! Your Practice has been submitted successfully.' : 'Are you sure want to submit?';

  return (
    <Dialog open={open} onOpenChange={setSubmitPopup}>
      <DialogTrigger asChild>
        <button aria-label="Submit Button" className={`p-2 w-28 rounded ${submitted ? 'border-2 border-gray-300' : 'bg-red-800 text-white'}`} onClick={() => setSubmitPopup(true)}>
          {submitted ? 'Results' : 'End Exam'}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black flex flex-col gap-4 w-[90%] mx-auto items-center">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center text-gray-800">{description}</DialogDescription>
        </DialogHeader>

        {submitted ? <Results /> : <UnattemptedSummary />}

        {!submitted && (
          <div className="mt-4 flex w-full justify-between">
            <button
              disabled={loading}
              className={`text-sm sm:text-base p-2 rounded w-24 sm:w-32 text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-3'}`}
              onClick={async () => {
                try {
                  setLoading(true);
                  await submitPractice();
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'Submitting...' : 'Yes, Submit'}
            </button>

            <button disabled={loading} className="text-sm sm:text-base p-2 bg-accent-2 rounded w-24 sm:w-32 text-white" onClick={() => setSubmitPopup(false)}>
              Cancel
            </button>
          </div>
        )}

        {submitted && (
          <div className="flex justify-center text-sm sm:text-base">
            <button className="p-2 rounded w-32 bg-accent-2 text-white" onClick={() => setSubmitPopup(false)}>
              Review
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
