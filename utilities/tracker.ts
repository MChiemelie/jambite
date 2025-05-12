import { Practices, Performances, MostPracticedSubjectResult, FullSubject } from '@/types';


export function calculateStreak(practiceData: Practices[]): number {
  if (practiceData.length === 0) return 0;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const dayIndices = Array.from(
    new Set(
      practiceData.map((p) =>
        Math.floor(new Date(p.timestamp).getTime() / MS_PER_DAY)
      )
    )
  ).sort((a, b) => a - b);

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dayIndices.length; i++) {
    if (dayIndices[i] - dayIndices[i - 1] === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

export function getMostPracticedSubject(
  performanceData: Performances[]
): MostPracticedSubjectResult {
  const subjectCounts: Record<string, number> = performanceData.reduce(
    (acc, { subject }) => {
      acc[subject] = (acc[subject] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const entries = Object.entries(subjectCounts).filter(
    ([subject]) => subject !== 'Use of English'
  );

  const [mostPracticedSubject, mostPracticedCount] = entries.reduce<
    [string, number]
  >(
    (maxPair, currPair) => (currPair[1] > maxPair[1] ? currPair : maxPair),
    ['', 0]
  );

  return { mostPracticedSubject, mostPracticedCount };
}
const subjectMap = {
  'Use of English': 'English',
  Mathematics: 'Maths',
  Commerce: 'Commerce',
  Accounting: 'Accounting',
  Biology: 'Biology',
  Physics: 'Physics',
  Chemistry: 'Chemistry',
  'Lit. In English': 'Lit. Eng',
  Government: 'Govt',
  'Christian Rel. Know': 'CRK',
  Geography: 'Geography',
  Economics: 'Economics',
  'Islamic Rel. Know': 'IRK',
  'Civic Education': 'Civic',
  History: 'History',
} as const;

export function abbreviateSubject(subject: string): string {
  if (subject in subjectMap) {
    return subjectMap[subject as FullSubject];
  }
  return subject;
}

