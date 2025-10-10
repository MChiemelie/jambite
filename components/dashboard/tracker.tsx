'use server';

import { calculateAnalytics } from '@/helpers/analytics';
import { getUserData } from '@/services';
import { CheckCheck, Flame, FlaskConical, LaptopMinimalCheck, Target, Timer } from 'lucide-react';
import { Card } from '.';

export default async function Tracker() {
  const analytics = await calculateAnalytics().catch(() => null);
  const user = await getUserData().catch(() => null);

  const practiceAnalytics = analytics?.practiceAnalytics || { totalPractices: 0, totalCorrect: 0, totalAttempts: 0 };
  const bestPractice = analytics?.bestPractice || { duration: 0, totalAttempts: 0, totalCorrect: 0 };
  const highestScore = analytics?.highestScore || { totalScore: 0 };
  const subjectsScoreData = analytics?.subjectsScoreData || [{ subject: 'None', score: 0 }];

  const { totalPractices, totalCorrect, totalAttempts } = practiceAnalytics;

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const bestPracticeScore = highestScore.totalScore ?? 0;
  const bestPerformance = subjectsScoreData[0] || { subject: 'None', score: 0 };

  const bestSubject = bestPerformance.subject || 'None';
  const bestScore = bestPerformance.score ?? 0;

  const bestTimeFormatted = bestPractice.duration ? `${Math.floor(bestPractice.duration / 60)}m ${bestPractice.duration % 60}s` : 'None';

  const currentStreak = user?.currentStreak ?? 0;
  const longestStreak = user?.longestStreak ?? 0;
  const trials = user?.trials ?? 0;

  const trackerItems = [
    {
      icon: LaptopMinimalCheck,
      color: 'text-blue-600',
      value: totalPractices.toString(),
      title: 'Practices',
      subtitle: `Successfully completed`,
    },
    {
      icon: CheckCheck,
      color: 'text-green-600',
      value: bestPracticeScore.toString(),
      title: 'Score',
      subtitle: `${bestSubject} (${bestScore})`,
    },
    {
      icon: Target,
      color: 'text-red-600',
      value: `${accuracy}%`,
      title: 'Accuracy',
      subtitle: `Aced ${totalCorrect}/${totalAttempts} attempts`,
    },
    {
      icon: Timer,
      color: 'text-yellow-400',
      value: bestTimeFormatted,
      title: 'Time',
      subtitle: `Attempts: ${bestPractice.totalAttempts || 0}, Score: ${bestPractice.totalCorrect || 0}`,
    },
    {
      icon: FlaskConical,
      color: 'text-orange-600',
      value: trials.toString(),
      title: 'Trials',
      subtitle: `Trial(s) left`,
    },
    {
      icon: Flame,
      color: 'text-red-600',
      value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`,
      title: 'Streak',
      subtitle: `Longest: ${longestStreak} ${longestStreak === 1 ? 'day' : 'days'}`,
    },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 max-w-full w-fit md:w-full place-items-center mx-auto">
      {trackerItems.map((card, index) => (
        <Card key={index} title={card.title} subtitle={card.subtitle} value={card.value} icon={<card.icon className={`w-5 h-5 ${card.color} ${card.icon === Flame ? 'fill-current' : ''}`} />} />
      ))}
    </div>
  );
}
