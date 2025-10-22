import type { Performance, PerformanceAnalytics } from '@/types';

export function computePerformanceSubjects(
  performances: Performance[]
): PerformanceAnalytics {
  const subjectsMap = performances.reduce<
    Record<
      string,
      {
        totalQuestions: number;
        totalAttempts: number;
        totalCorrect: number;
        score: number;
      }
    >
  >((acc, p) => {
    const key = p.subject || 'Unknown';
    if (!acc[key])
      acc[key] = {
        totalQuestions: 0,
        totalAttempts: 0,
        totalCorrect: 0,
        score: 0
      };
    acc[key].totalQuestions += Number(p.totalQuestions ?? 0);
    acc[key].totalAttempts += Number(p.attempts ?? 0);
    acc[key].totalCorrect += Number(p.correct ?? 0);
    acc[key].score = Math.max(acc[key].score, Number(p.score ?? 0));
    return acc;
  }, {});

  const subjects = Object.entries(subjectsMap)
    .map(([subject, v]) => ({
      subject,
      totalQuestions: v.totalQuestions,
      totalAttempts: v.totalAttempts,
      totalCorrect: v.totalCorrect,
      score: v.score
    }))
    .sort((a, b) => b.score - a.score);

  const totalCorrect = subjects.reduce((s, sub) => s + sub.totalCorrect, 0);
  const totalAttempts = subjects.reduce((s, sub) => s + sub.totalAttempts, 0);

  return {
    totalCorrect,
    totalAttempts,
    subjects
  } as PerformanceAnalytics;
}
