'use client';

import { Flag } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/dialog';
import { useUser } from '@/contexts';
import {
  useCurrentQuestion,
  useQuestions,
  useSelectedSubject
} from '@/stores/practice';
import type { Question } from '@/types';

export default function Report() {
  const questions = useQuestions();
  const subject = useSelectedSubject();
  const { user } = useUser();

  const currentQuestionsData = useMemo(
    () => questions[subject] ?? [],
    [questions, subject]
  );
  const currentQuestion = useCurrentQuestion();

  const currentQuestionData =
    currentQuestionsData[currentQuestion] || ({} as Question);
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject,
          question_id: questionId,
          message,
          full_name: user?.avatarId,
          type: reportType
        })
      });
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }
      setSuccess(true);
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
        <button
          className="md:text-md flex items-center gap-2 rounded border-2 border-gray-300 p-2 text-sm text-gray-700"
          type="button"
        >
          <Flag className="h-4 w-4" />
          <span>Report Question</span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90%] rounded bg-white text-black sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-center">Report Question</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-800 md:text-lg">
            We would love to know the exact issue you found with the question.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block font-medium"
              htmlFor="report_type"
              aria-label="report_type"
            >
              Report Type
              <select
                value={reportType}
                onChange={(e) => setReportType(parseInt(e.target.value, 10))}
                className="w-full rounded border bg-white p-2 text-black"
              >
                <option value={1}>Question</option>
                <option value={2}>Option A</option>
                <option value={3}>Option B</option>
                <option value={4}>Option C</option>
                <option value={5}>Option D</option>
                <option value={6}>Answer</option>
                <option value={7}>Solution</option>
              </select>
            </label>
          </div>
          <div>
            <label
              className="block font-medium"
              htmlFor="report_message"
              aria-label="report_message"
            >
              Message (optional)
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded border bg-white p-1 text-black"
                placeholder="Describe the issue..."
              />
            </label>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && (
            <p className="text-green-600">Report submitted successfully!</p>
          )}
          <div className="flex w-full justify-between">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-20 rounded border p-1 text-gray-600 md:w-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-2 w-20 rounded p-1 text-white md:w-40"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
