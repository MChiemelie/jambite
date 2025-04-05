// Results.tsx
import React from 'react';
import { Question } from '@/types';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  totalNumberAttempted: number;
  elapsedTime: number; // elapsed time in seconds
  subjectScores: { [subject: string]: number };
  questions: { [subject: string]: Question[] };
  numberAttempted: { [subject: string]: number };
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, totalNumberAttempted, elapsedTime, subjectScores, questions, numberAttempted }) => {
  const durationMinutes = Math.floor(elapsedTime / 60);
  const durationSeconds = elapsedTime % 60;

  const totalScore = Object.keys(subjectScores).reduce((acc, subject) => {
    const totalForSubject = questions[subject]?.length || 0;
    if (totalForSubject > 0) {
      const percentage = Number(((subjectScores[subject] / totalForSubject) * 100).toFixed());
      return acc + percentage;
    }
    return acc;
  }, 0);

  return (
    <div className="text-center text-xs sm:text-sm md:text-base gap-1">
      <p className="mt-4">
        Accuracy: {score}/{totalQuestions} ({((score / totalQuestions) * 100).toFixed()}%)
      </p>
      <p>
        Total Attempts: {totalNumberAttempted}/{totalQuestions} ({((totalNumberAttempted / totalQuestions) * 100).toFixed()}%)
      </p>
      <p>
        Duration: {durationMinutes} mins, {durationSeconds} secs
      </p>
      <p>Total Score: {totalScore}</p>
      <table className="md:min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">Subject</th>
            <th className="px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">Correct</th>
            <th className="px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">Score (100)</th>
            <th className="px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">Attempts (%)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(questions).map((subject) => {
            const totalForSubject = questions[subject].length;
            const correctForSubject = subjectScores[subject] || 0;
            const jambScoreForSubject = totalForSubject > 0 ? ((correctForSubject / totalForSubject) * 100).toFixed() : '0';
            const attemptedForSubject = numberAttempted[subject] || 0;
            const attemptPercentage = totalForSubject > 0 ? ((attemptedForSubject / totalForSubject) * 100).toFixed() : '0';

            return (
              <tr key={subject}>
                <td className="border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">{subject}</td>
                <td className="border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">{correctForSubject}</td>
                <td className="border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">{jambScoreForSubject}</td>
                <td className="border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base">
                  {attemptedForSubject}/{totalForSubject} ({attemptPercentage})
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
