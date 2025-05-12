'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { Results, UnattemptedSummary, Practice } from '@/components/practice';
import { usePracticeActions, useSubmitPopup, useSubmitted, useTimeEnd } from '@/stores/practice';

export default function SubmitButton() {
  const submitted = useSubmitted();
  const timeEnd = useTimeEnd();
  const open = useSubmitPopup();
  const { setSubmitPopup, submitPractice } = usePracticeActions();

  const title = timeEnd ? 'Your time is up!' : submitted ? 'Practice Submitted Successfully!' : 'Confirm Submission';
  const description = submitted ? 'Congratulations! Your Practice has been submitted successfully.' : 'Are you sure want to submit?';

  return (
    <Dialog open={open} onOpenChange={setSubmitPopup}>
      <DialogTrigger asChild>
        <button className={`p-2 w-28 rounded ${submitted ? 'border-2 border-gray-300' : 'bg-red-800 text-white'}`} onClick={() => setSubmitPopup(true)}>
          {submitted ? 'Results' : 'End Exam'}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black p-4 w-[90%] max-w-4xl flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center text-gray-800">{description}</DialogDescription>
        </DialogHeader>

        <div>{submitted ? <Results /> : <UnattemptedSummary />}</div>

        {!submitted && (
          <div className="mt-4 flex w-full justify-between">
            <button
              className="p-2 bg-accent-3 rounded w-32 text-white"
              onClick={() => {
                submitPractice();
              }}
            >
              Yes, Submit
            </button>
            <button className="p-2 bg-accent-2 rounded w-32 text-white" onClick={() => setSubmitPopup(false)}>
              Cancel
            </button>
          </div>
        )}

        {(submitted) && (
          <div className="flex justify-center">
            <button className="p-2 rounded w-32 bg-accent-2 text-white" onClick={() => setSubmitPopup(false)}>
              Review
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
