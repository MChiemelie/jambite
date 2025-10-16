import type { Performance, Practice } from '@/types';

const toNumber = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
export const convertToString = (v: unknown, fallback = 'Unknown') => (v == null ? fallback : String(v));

export const normalizePractice = (raw: any): Practice => {
  const data = raw.data ?? raw;
  return {
    practiceId: String(raw.$id ?? data.practiceId ?? ''),
    timestamp: convertToString(data.timestamp ?? data.$timestamp ?? ''),
    duration: toNumber(data.duration, 0),
    totalAttempts: toNumber(data.totalAttempts ?? data.attempts, 0),
    totalQuestions: toNumber(data.totalQuestions, 0),
    totalCorrect: toNumber(data.totalCorrect, 0),
    totalScore: toNumber(data.totalScore, 0),
    userId: String(data.userId ?? ''),
    createdAt: String(raw.$createdAt ?? data.createdAt ?? '')
  } as Practice;
};

export const normalizePerformance = (raw: any): Performance => {
  const data = raw.data ?? raw;
  return {
    performanceId: String(raw.$id ?? data.performanceId ?? ''),
    userId: String(data.userId ?? ''),
    correct: toNumber(data.correct ?? 0, 0),
    attempts: toNumber(data.attempts ?? data.totalAttempts ?? 0, 0),
    totalQuestions: toNumber(data.totalQuestions ?? 0, 0),
    subject: convertToString(data.subject ?? 'Unknown'),
    score: toNumber(data.score ?? 0, 0),
    practiceId: String(data.practiceId ?? ''),
    createdAt: String(raw.$createdAt ?? data.createdAt ?? '')
  } as Performance;
};
