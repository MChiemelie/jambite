'use server';

import { getPerformances, getPractices } from '@/services/analytics';
import { AccuracyProps, AcumenProps, AnalyticsResult, DurationProps, MostPracticedSubjectResult, PerformanceAnalytics, PracticeAnalytics, ScoresProps, SubjectsProps } from '@/types';
import { getMostPracticedSubject } from '@/utilities';

export const calculateAnalytics = async (): Promise<AnalyticsResult> => {
  const practices = await getPractices();
  const performances = await getPerformances();

  const totalPractices = practices.length;
  const totalDuration = practices.reduce((sum, p) => sum + p.duration, 0);
  const totalQuestions = practices.reduce((sum, p) => sum + p.totalQuestions, 0);
  const totalAttempts = practices.reduce((sum, p) => sum + p.totalAttempts, 0);
  const totalCorrect = practices.reduce((sum, p) => sum + p.totalCorrect, 0);
  const totalScore = practices.reduce((sum, p) => sum + p.totalScore, 0);
  const totalIncorrect = totalAttempts - totalCorrect;
  const averageDuration = practices.length ? totalDuration / practices.length : 0;

  const practiceAnalytics: PracticeAnalytics = {
    totalPractices,
    totalDuration,
    totalQuestions,
    totalCorrect,
    totalScore,
    totalIncorrect,
    totalAttempts,
  };

  const subjectsMap = performances.reduce<Record<string, { totalQuestions: number; totalAttempts: number; totalCorrect: number; score: number }>>((acc, p) => {
    if (!acc[p.subject]) {
      acc[p.subject] = {
        totalQuestions: p.totalQuestions,
        totalAttempts: p.attempts,
        totalCorrect: p.correct,
        score: p.score,
      };
    } else {
      acc[p.subject].totalQuestions += p.totalQuestions;
      acc[p.subject].totalAttempts += p.attempts;
      acc[p.subject].totalCorrect += p.correct;
      acc[p.subject].score = Math.max(acc[p.subject].score, p.score);
    }
    return acc;
  }, {});

  const performanceAnalytics: PerformanceAnalytics = {
    totalCorrect: totalCorrect,
    totalAttempts: totalAttempts,
    subjects: Object.entries(subjectsMap).map(([subject, v]) => ({
      subject,
      totalQuestions: v.totalQuestions,
      totalAttempts: v.totalAttempts,
      totalCorrect: v.totalCorrect,
      score: v.score,
    })),
  };

  const accuracyData: AccuracyProps['data'] = [
    {
      correct: totalCorrect,
      incorrect: totalAttempts - totalCorrect,
    },
  ];

  const subjectsScoreData: ScoresProps['data'] = performanceAnalytics.subjects
    .map((s) => ({
      subject: s.subject,
      score: s.score,
    }))
    .slice(0, 4);

  const subjectsAttemptsData: SubjectsProps['data'] = performanceAnalytics.subjects
    .map((s) => ({
      subject: s.subject,
      attempts: s.totalAttempts,
    }))
    .filter((s) => s.subject !== 'Use of English')
    .slice(0, 4);

  const acumenData: AcumenProps['data'] = performanceAnalytics.subjects
    .map((s) => ({
      subject: s.subject,
      correct: s.totalCorrect,
      incorrect: s.totalAttempts - s.totalCorrect,
    }))
    .slice(0, 4);

  const bestPractice = practices.reduce((best, curr) => {
    const bestRatio = best.totalScore / best.duration;
    const currRatio = curr.totalScore / curr.duration;
    return currRatio > bestRatio ? curr : best;
  }, practices[0]);

  const shortestPractice = practices.reduce((shortest, curr) => (curr.duration < shortest.duration ? curr : shortest), practices[0]);

  const longestPractice = practices.reduce((longestest, curr) => (curr.duration > longestest.duration ? curr : longestest), practices[0]);

  const highestScore = practices.reduce((highest, curr) => (curr.totalScore > highest.totalScore ? curr : highest), practices[0]);

  const durationData: DurationProps = [
    { metric: 'Best', score: bestPractice.totalScore, duration: bestPractice.duration },

    { metric: 'Fastest', score: shortestPractice.totalScore, duration: shortestPractice.duration },

    { metric: 'Longest', score: longestPractice.totalScore, duration: longestPractice.duration },

    { metric: 'Highest', score: highestScore.totalScore, duration: highestScore.duration },

    { metric: 'Average', score: totalScore / practices.length || 0, duration: averageDuration },
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
    bestPractice,
    highestScore,
  };
};
