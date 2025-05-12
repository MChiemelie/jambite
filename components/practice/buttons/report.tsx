'use client';

import { useMemo, useState } from 'react';
import { Flag } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { useCurrentQuestion, useQuestions, useSelectedSubject, useUser } from '@/stores/practice';
import { Question } from '@/types';

export default function Report() {
  const questions = useQuestions();
  const subject = useSelectedSubject();
  const user = useUser();

  const currentQuestionsData = useMemo(() => questions[subject] ?? [], [questions, subject]);
  const currentQuestion = useCurrentQuestion();

  const currentQuestionData = currentQuestionsData[currentQuestion] || ({} as Question);
  const { id: questionId } = currentQuestionData;

  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://questions.aloc.com.ng/api/r', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          question_id: questionId,
          message,
          full_name: user?.fullname,
          type: reportType,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }
      setSuccess(true);
      // onReportSubmitted?.(); This function was passed through props. It meant to run a function after the report was submitted
      // Optionally close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setMessage('');
        setReportType(1);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-gray-700 p-2 rounded border-2 border-gray-300 text-md">
          <Flag className="w-4 h-4" />
          <span>Report Question</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center">Report Question</DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-800">We would love to know the exact issue you found with the question.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(parseInt(e.target.value))} className="w-full border p-2 rounded bg-white text-black">
              <option value={1}>Question</option>
              <option value={2}>Option A</option>
              <option value={3}>Option B</option>
              <option value={4}>Option C</option>
              <option value={5}>Option D</option>
              <option value={6}>Answer</option>
              <option value={7}>Solution</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Message (optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border p-1 rounded bg-white text-black" placeholder="Describe the issue..." />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">Report submitted successfully!</p>}
          <div className="flex justify-between w-full">
            <button type="button" onClick={() => setOpen(false)} className="text-gray-600 w-40 border p-1 rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-accent-2 text-white w-40 p-1 rounded">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
