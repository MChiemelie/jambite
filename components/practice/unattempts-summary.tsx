import React from 'react';

interface UnattemptedSummaryProps {
  unattemptedQuestions: Record<string, number[]>;
}

const UnattemptedSummary: React.FC<UnattemptedSummaryProps> = ({ unattemptedQuestions }) => {
  const totalUnattempted = Object.values(unattemptedQuestions).flat().length;

  return (
    <>
      {totalUnattempted > 0 ? (
        <>
          <p className="text-center">You still have {totalUnattempted} unattempted question(s).</p>
          <table className="md:min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-1 md:px-4 lg:py-2">Subject</th>
                <th className="px-2 py-1 md:px-4 lg:py-2">Unattempted</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(unattemptedQuestions).map((subject) => (
                <tr key={subject}>
                  <td className="border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base font-semibold">{subject}</td>
                  <td className="border px-2 py-1 md:px-4 lg:py-2 text-xs sm:text-sm md:text-base text-center">{unattemptedQuestions[subject]?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-center text-xs sm:text-sm md:text-base">Ensure you have reviewed your answers before submission.</p>
      )}
    </>
  );
};

export default UnattemptedSummary;
