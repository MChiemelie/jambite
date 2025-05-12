import { Accuracy, Acumen, Attempts, Duration, ScoreTrend, Scores, Subjects } from '@/components/analytics';
import { getPerformance, getPractice } from '@/services/practice';
import { PerformanceAnalytics, Performances, PracticeAnalytics, Practices } from '@/types/analytics';

export default async function AnalyticsPage() {
  const [performanceData, practiceData]: [Performances[], Practices[]] = await Promise.all([getPerformance(), getPractice()]);

  const analyticsData: { performance: PerformanceAnalytics; practice: PracticeAnalytics } = {
    performance: {
      totalCorrect: performanceData.reduce((sum, p) => sum + p.correct, 0),
      totalAttempts: performanceData.reduce((sum, p) => sum + p.attempts, 0),
      subjects: performanceData.map((p) => ({
        subject: p.subject,
        totalQuestions: p.totalSubjectQuestions,
        totalAttempts: p.attempts,
        score: p.score,
      })),
    },
    practice: {
      totalDuration: practiceData.reduce((sum, p) => sum + p.duration, 0),
      totalQuestions: practiceData.reduce((sum, p) => sum + p.totalQuestions, 0),
      totalCorrect: practiceData.reduce((acc, p) => acc + p.totalCorrect, 0),
      totalScore: practiceData.reduce((sum, p) => sum + p.totalScore, 0),
      totalAttempts: practiceData.reduce((acc, p) => acc + Number(p.totalAttempts), 0),
      totalIncorrect: practiceData.reduce((acc, p) => acc + (p.totalAttempts - p.totalCorrect), 0),
    },
  };

  const highestScoresBySubject = performanceData.reduce<Record<string, Performances>>(
      (acc, p) => {
        const prev = acc[p.subject];
        if (!prev || prev.score < p.score) {
          acc[p.subject] = p;
        }
        return acc;
      },
      {} as Record<string, Performances>
    );

  const subjectsScoreData = Object.values(highestScoresBySubject).map((p) => ({
    subject: p.subject,
    score: p.score,
  }));

  const acumenData = performanceData.reduce(
    (acc, item) => {
      const existingSubject = acc.find((entry) => entry.subject === item.subject);
      if (existingSubject) {
        existingSubject.correct += item.correct;
        existingSubject.incorrect += item.attempts - item.correct;
      } else {
        acc.push({
          subject: item.subject,
          correct: item.correct,
          incorrect: item.attempts - item.correct,
        });
      }
      return acc;
    },
    [] as { subject: string; correct: number; incorrect: number }[]
  );

  const accuracyData = [
    {
      correct: analyticsData.performance.totalCorrect,
      incorrect: analyticsData.practice.totalIncorrect,
    },
  ];

  const subjectsAttemptsData = Object.entries(
    performanceData.reduce(
      (acc, item) => {
        acc[item.subject] = (acc[item.subject] || 0) + item.attempts;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([subject, attempts]) => ({ subject, attempts: attempts as number }));

  const totalAttempts = analyticsData.performance.totalAttempts + analyticsData.practice.totalAttempts;
  const totalQuestions = analyticsData.performance.subjects.reduce((sum, p) => sum + p.totalQuestions, 0) + analyticsData.practice.totalQuestions;

  return (
    <section className="p-2 md:p-4 lg:p-8 w-full">
      <figure className="quote text-center mb-10">
        <blockquote>
          <p className="font-bold italic text-lg">“Above all else, show the data.”</p>
        </blockquote>
        <figcaption>
          —{' '}
          <cite>
            Edward R. Tufte, <em>The Visual Display of Quantitative Information</em>
          </cite>
        </figcaption>
      </figure>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <div className="col-span-full">
          <ScoreTrend />
        </div>
        <Accuracy data={accuracyData} />
        <Attempts totalAttempts={totalAttempts} totalQuestions={totalQuestions} />
        <Subjects data={subjectsAttemptsData} />
        <Scores data={subjectsScoreData} />
        <Duration data={practiceData} />
        <Acumen data={acumenData} />
      </div>
    </section>
  );
}
