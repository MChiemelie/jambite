'use server';

import { getPerformances, getPractices } from '@/services/analytics';
import type {
  AccuracyProps,
  AcumenProps,
  AnalyticsResult,
  ScoresProps,
  SubjectsProps
} from '@/types';
import { getMostPracticedSubject } from '@/utilities';
import { normalizePerformance, normalizePractice } from './normalize';
import { computePerformanceSubjects } from './performance';
import { computePracticeAggregates } from './practice';

export const calculateAnalytics = async (): Promise<AnalyticsResult> => {
  const [rawPractices, rawPerformances] = await Promise.all([
    getPractices(),
    getPerformances()
  ]);
  const practices = (rawPractices ?? []).map(normalizePractice);
  const performances = (rawPerformances ?? []).map(normalizePerformance);

  const { practiceAnalytics, durationData, bestPractice, highestScore } =
    computePracticeAggregates(practices);
  const performanceAnalytics = computePerformanceSubjects(performances);

  const accuracyData: AccuracyProps['data'] = [
    {
      correct: practiceAnalytics.totalCorrect,
      incorrect:
        practiceAnalytics.totalAttempts - practiceAnalytics.totalCorrect
    }
  ];

  const subjectsScoreData: ScoresProps['data'] = performanceAnalytics.subjects
    .map((s) => ({ subject: s.subject, score: s.score }))
    .slice(0, 4);

  const subjectsAttemptsData: SubjectsProps['data'] =
    performanceAnalytics.subjects
      .map((s) => ({ subject: s.subject, attempts: s.totalAttempts }))
      .filter((s) => s.subject !== 'Use of English')
      .slice(0, 4);

  const acumenData: AcumenProps['data'] = performanceAnalytics.subjects
    .map((s) => ({
      subject: s.subject,
      correct: s.totalCorrect,
      incorrect: s.totalAttempts - s.totalCorrect
    }))
    .slice(0, 4);

  const mostPracticed = (await getMostPracticedSubject()) ?? {
    mostPracticedSubject: 'None',
    mostPracticedCount: 0
  };

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
    highestScore
  };
};
