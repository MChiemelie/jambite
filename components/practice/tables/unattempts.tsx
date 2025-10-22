'use client';

import { useUnattemptedQuestions } from '@/stores/practice';

export default function UnattemptedSummary() {
  const unattemptedQuestions = useUnattemptedQuestions();

  const totalUnattempted = Object.values(unattemptedQuestions).flat().length;

  return (
    <>
      {totalUnattempted > 0 ? (
        <>
          <p className="block w-full text-center">
            You still have {totalUnattempted} unattempted question(s).
          </p>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-1 md:px-4 lg:py-2">Subject</th>
                <th className="px-2 py-1 md:px-4 lg:py-2">Unattempted</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(unattemptedQuestions).map((subject) => (
                <tr key={subject}>
                  <td className="border px-2 py-1 text-xs font-semibold sm:text-sm md:px-4 md:text-base lg:py-2">
                    {subject}
                  </td>
                  <td className="border px-2 py-1 text-center text-xs sm:text-sm md:px-4 md:text-base lg:py-2">
                    {unattemptedQuestions[subject]?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-center text-xs sm:text-sm md:text-base">
          Ensure you have reviewed your answers before submission.
        </p>
      )}
    </>
  );
}
