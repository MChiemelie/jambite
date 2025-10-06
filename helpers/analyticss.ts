'use server';

import { getPerformances, getPractices } from '@/services/analytics';
import { AccuracyProps, AcumenProps, AnalyticsResult, DurationProps, MostPracticedSubjectResult, PerformanceAnalytics, PracticeAnalytics, ScoresProps, SubjectsProps } from '@/types';
import { getMostPracticedSubject } from '@/utilities';

const toNumber = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const toString = (v: unknown, fallback = 'Unknown') => (v == null ? fallback : String(v));

export const calculateAnalytics = async (): Promise<AnalyticsResult> => {
  const practicesRaw = (await getPractices()) ?? [];
  const performancesRaw = (await getPerformances()) ?? [];

  // Normalize minimal shape (defensive)
  const practices = practicesRaw.map((p) => ({
    ...p,
    duration: toNumber(p.duration, 0),
    totalAttempts: toNumber(p.totalAttempts, 0),
    totalQuestions: toNumber(p.totalQuestions, 0),
    totalCorrect: toNumber(p.totalCorrect, 0),
    totalScore: toNumber(p.totalScore, 0),
  }));

  const performances = performancesRaw.map((p) => ({
    ...p,
    subject: toString(p.subject, 'Unknown'),
    score: toNumber(p.score, 0),
    attempts: toNumber((p as any).attempts ?? (p as any).totalAttempts ?? 0, 0),
    correct: toNumber((p as any).correct ?? 0, 0),
    totalQuestions: toNumber(p.totalQuestions ?? 0, 0),
  }));

  // PRACTICE AGGREGATES (single reduce)
  const practiceAgg = practices.reduce(
    (acc, p) => {
      acc.totalPractices += 1;
      acc.totalDuration += p.duration;
      acc.totalQuestions += p.totalQuestions;
      acc.totalAttempts += p.totalAttempts;
      acc.totalCorrect += p.totalCorrect;
      acc.totalScore += p.totalScore;

      // best by score/duration ratio (guard duration)
      const currRatio = p.duration > 0 ? p.totalScore / p.duration : p.totalScore;
      if (!acc.bestPractice || currRatio > acc.bestRatio) {
        acc.bestRatio = currRatio;
        acc.bestPractice = p;
      }

      if (!acc.shortest || p.duration < acc.shortest.duration) acc.shortest = p;
      if (!acc.longest || p.duration > acc.longest.duration) acc.longest = p;
      if (!acc.highestScore || p.totalScore > acc.highestScore.totalScore) acc.highestScore = p;

      return acc;
    },
    {
      totalPractices: 0,
      totalDuration: 0,
      totalQuestions: 0,
      totalAttempts: 0,
      totalCorrect: 0,
      totalScore: 0,
      bestPractice: null as any,
      bestRatio: -Infinity,
      shortest: null as any,
      longest: null as any,
      highestScore: null as any,
    }
  );

  const { totalPractices, totalDuration, totalQuestions, totalAttempts, totalCorrect, totalScore, bestPractice, shortest, longest, highestScore } = practiceAgg;

  const averageDuration = totalPractices ? totalDuration / totalPractices : 0;
  const totalIncorrect = totalAttempts - totalCorrect;

  const practiceAnalytics: PracticeAnalytics = {
    totalPractices,
    totalDuration,
    totalQuestions,
    totalCorrect,
    totalScore,
    totalIncorrect,
    totalAttempts,
  };

  // PERFORMANCE / SUBJECT AGGREGATION
  const subjectsMap = performances.reduce<Record<string, { totalQuestions: number; totalAttempts: number; totalCorrect: number; score: number }>>((acc, p) => {
    const key = p.subject || 'Unknown';
    if (!acc[key]) {
      acc[key] = { totalQuestions: 0, totalAttempts: 0, totalCorrect: 0, score: 0 };
    }
    acc[key].totalQuestions += toNumber(p.totalQuestions, 0);
    acc[key].totalAttempts += toNumber(p.attempts, 0);
    acc[key].totalCorrect += toNumber(p.correct, 0);
    acc[key].score = Math.max(acc[key].score, toNumber(p.score, 0));
    return acc;
  }, {});

  const performanceSubjects = Object.entries(subjectsMap).map(([subject, v]) => ({
    subject,
    totalQuestions: v.totalQuestions,
    totalAttempts: v.totalAttempts,
    totalCorrect: v.totalCorrect,
    score: v.score,
  }));

  const performanceAnalytics: PerformanceAnalytics = {
    totalCorrect,
    totalAttempts,
    subjects: performanceSubjects,
  };

  // READY-TO-RETURN SHAPES (kept exact)
  const accuracyData: AccuracyProps['data'] = [
    {
      correct: totalCorrect,
      incorrect: totalIncorrect,
    },
  ];

  const subjectsScoreData: ScoresProps['data'] = performanceSubjects.map((s) => ({ subject: s.subject, score: s.score })).slice(0, 4);

  const subjectsAttemptsData: SubjectsProps['data'] = performanceSubjects
    .map((s) => ({ subject: s.subject, attempts: s.totalAttempts }))
    .filter((s) => s.subject !== 'Use of English')
    .slice(0, 4);

  const acumenData: AcumenProps['data'] = performanceSubjects.map((s) => ({ subject: s.subject, correct: s.totalCorrect, incorrect: s.totalAttempts - s.totalCorrect })).slice(0, 4);

  const best = bestPractice ?? practices[0] ?? { duration: 0, totalAttempts: 0, totalQuestions: 0, totalCorrect: 0, totalScore: 0, practiceId: '' };
  const shortestPractice = shortest ?? best;
  const longestPractice = longest ?? best;
  const highest = highestScore ?? best;

  const durationData: DurationProps = [
    { metric: 'Best', score: best.totalScore ?? 0, duration: best.duration ?? 0 },
    { metric: 'Fastest', score: shortestPractice.totalScore ?? 0, duration: shortestPractice.duration ?? 0 },
    { metric: 'Longest', score: longestPractice.totalScore ?? 0, duration: longestPractice.duration ?? 0 },
    { metric: 'Highest', score: highest.totalScore ?? 0, duration: highest.duration ?? 0 },
    { metric: 'Average', score: totalPractices ? totalScore / totalPractices : 0, duration: averageDuration },
  ];

  const mostPracticed: MostPracticedSubjectResult = await getMostPracticedSubject();

  return {
    practiceAnalytics,
    performanceAnalytics,
    accuracyData,
    subjectsScoreData,
    subjectsAttemptsData,
    acumenData,
    durationData,
    mostPracticed,
    bestPractice: best,
    highestScore: highest,
  };
};
