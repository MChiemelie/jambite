import type { DurationProps, Practice, PracticeAnalytics } from '@/types';

export function computePracticeAggregates(practices: Practice[]) {
  const initial = {
    totalPractices: 0,
    totalDuration: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    totalScore: 0,
    bestPractice: null as Practice | null,
    bestRatio: -Infinity,
    shortest: null as Practice | null,
    longest: null as Practice | null,
    highestScore: null as Practice | null
  };

  const acc = practices.reduce((s, p) => {
    s.totalPractices += 1;
    s.totalDuration += p.duration;
    s.totalQuestions += p.totalQuestions;
    s.totalAttempts += p.totalAttempts;
    s.totalCorrect += p.totalCorrect;
    s.totalScore += p.totalScore;

    const currRatio = p.duration > 0 ? p.totalScore / p.duration : p.totalScore;
    if (!s.bestPractice || currRatio > s.bestRatio) {
      s.bestRatio = currRatio;
      s.bestPractice = p;
    }

    if (!s.shortest || p.duration < s.shortest.duration) s.shortest = p;
    if (!s.longest || p.duration > s.longest.duration) s.longest = p;
    if (!s.highestScore || p.totalScore > s.highestScore.totalScore)
      s.highestScore = p;

    return s;
  }, initial);

  const averageDuration = acc.totalPractices
    ? acc.totalDuration / acc.totalPractices
    : 0;
  const totalIncorrect = acc.totalAttempts - acc.totalCorrect;

  const practiceAnalytics: PracticeAnalytics = {
    totalPractices: acc.totalPractices,
    totalDuration: acc.totalDuration,
    totalQuestions: acc.totalQuestions,
    totalCorrect: acc.totalCorrect,
    totalScore: acc.totalScore,
    totalIncorrect,
    totalAttempts: acc.totalAttempts
  };

  const best = acc.bestPractice ??
    practices[0] ?? {
      duration: 0,
      totalScore: 0,
      totalAttempts: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      practiceId: ''
    };
  const shortest = acc.shortest ?? best;
  const longest = acc.longest ?? best;
  const highest = acc.highestScore ?? best;

  const durationData: DurationProps = [
    {
      metric: 'Best',
      score: best.totalScore ?? 0,
      duration: best.duration ?? 0
    },
    {
      metric: 'Fastest',
      score: shortest.totalScore ?? 0,
      duration: shortest.duration ?? 0
    },
    {
      metric: 'Longest',
      score: longest.totalScore ?? 0,
      duration: longest.duration ?? 0
    },
    {
      metric: 'Highest',
      score: highest.totalScore ?? 0,
      duration: highest.duration ?? 0
    },
    {
      metric: 'Average',
      score: acc.totalPractices ? acc.totalScore / acc.totalPractices : 0,
      duration: averageDuration
    }
  ];

  return {
    practiceAnalytics,
    durationData,
    bestPractice: best,
    highestScore: highest
  };
}
