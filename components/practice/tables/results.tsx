'use client';

import {
  useDuration,
  useNumberAttempted,
  useQuestions,
  useSubjectScores,
  useTotalCorrect,
  useTotalNumberAttempted,
  useTotalQuestions,
  useTotalScore
} from '@/stores/practice';

export default function Results() {
  const questions = useQuestions();
  const totalNumberAttempted = useTotalNumberAttempted();
  const subjectScores = useSubjectScores();
  const totalCorrect = useTotalCorrect();
  const totalScore = useTotalScore();
  const duration = useDuration();
  const numberAttempted = useNumberAttempted();
  const totalQuestions = useTotalQuestions();

  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = duration % 60;

  return (
    <div className='text-center text-xs sm:text-sm md:text-base gap-1'>
      <p className='block w-full'>
        Accuracy: {totalCorrect}/{totalQuestions} (
        {((totalCorrect / totalQuestions) * 100).toFixed()}%)
      </p>
      <p className='block w-full'>
        Total Attempts: {totalNumberAttempted}/{totalQuestions} (
        {((totalNumberAttempted / totalQuestions) * 100).toFixed()}%)
      </p>
      <p className='block w-full'>
        Duration: {durationMinutes} mins, {durationSeconds} secs
      </p>
      <p className='block w-full'>Total Score: {totalScore}</p>
      <table className='w-full table-auto'>
        <thead>
          <tr>
            <th className='px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
              Subject
            </th>
            <th className='px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
              Correct
            </th>
            <th className='px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
              Score (100)
            </th>
            <th className='px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
              Attempts (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(questions).map((subject) => {
            const totalForSubject = questions[subject].length;
            const correctForSubject = subjectScores[subject] || 0;
            const jambScoreForSubject =
              totalForSubject > 0
                ? ((correctForSubject / totalForSubject) * 100).toFixed()
                : '0';
            const attemptedForSubject = numberAttempted[subject] || 0;
            const attemptPercentage =
              totalForSubject > 0
                ? ((attemptedForSubject / totalForSubject) * 100).toFixed()
                : '0';

            return (
              <tr key={subject}>
                <td className='border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
                  {subject}
                </td>
                <td className='border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
                  {correctForSubject}
                </td>
                <td className='border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
                  {jambScoreForSubject}
                </td>
                <td className='border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base'>
                  {attemptedForSubject}/{totalForSubject} ({attemptPercentage})
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
