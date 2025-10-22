import { getPerformances } from '@/services/analytics';
import type { MostPracticedSubjectResult } from '@/types';

export async function getMostPracticedSubject(): Promise<MostPracticedSubjectResult> {
  const performances = await getPerformances();

  if (!performances.length) {
    return { mostPracticedSubject: '', mostPracticedCount: 0 };
  }

  const subjectCounts: Record<string, number> = performances.reduce(
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
