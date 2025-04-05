import React from 'react';
import { Book, CheckCheck, CircleHelp, Flame, LaptopMinimalCheck, Rabbit, Target, Watch } from 'lucide-react';
import { Stat } from '@/components/custom';
import { getPerformance, getPractice } from '@/services/practice';
import { abbreviateSubject, calculateStreak, getMostPracticedSubject } from '@/utilities';

export default async function Tracker() {
  const [performanceData, practiceData] = await Promise.all([getPerformance(), getPractice()]);

  const totalPractices = practiceData.length;
  const totalCorrect = performanceData.reduce((acc, p) => acc + p.correct, 0);
  const totalQuestions = practiceData.reduce((acc, p) => acc + Number(p.totalQuestions), 0);
  const totalAttempts = practiceData.reduce((acc, p) => acc + Number(p.totalAttempts), 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const totalDuration = practiceData.reduce((acc, p) => acc + p.duration, 0);
  const attemptPercentage = totalQuestions > 0 ? Math.round((totalAttempts / totalQuestions) * 100) : 0;
  const bestPractice = practiceData.reduce((best, curr) => (curr.totalScore > best.totalScore ? curr : best), { totalScore: 0 });
  const highestScore = bestPractice.totalScore;
  const bestPerformance = performanceData.filter((p) => p.subject !== 'Use of English').reduce((best, curr) => (curr.score > best.score ? curr : best), { subject: 'None', score: 0 });
  const bestSubject = bestPerformance.subject;
  const bestScore = bestPerformance.score;
  const bestTimePractice = practiceData.filter((p) => p.totalAttempts > 0 && p.totalScore > 0).sort((a, b) => a.duration - b.duration || b.totalScore - a.totalScore || b.totalAttempts - a.totalAttempts)[0];
  const bestTimeFormatted = bestTimePractice ? `${Math.floor(bestTimePractice.duration / 60)}m ${bestTimePractice.duration % 60}s` : 'None';
  const streak = calculateStreak(practiceData);
  const { mostPracticedSubject, mostPracticedCount } = getMostPracticedSubject(performanceData);
  const abbreviatedSubject = abbreviateSubject(mostPracticedSubject);

  const trackerItems = [
    {
      icon: LaptopMinimalCheck,
      color: 'text-blue-600',
      value: totalPractices.toString(),
      title: 'Practices',
      subtitle: `Completed ${totalPractices} practices!`,
    },
    {
      icon: CheckCheck,
      color: 'text-green-600',
      value: highestScore.toString(),
      title: 'Score',
      subtitle: `Subject: ${bestSubject} (${bestScore})`,
    },
    {
      icon: Book,
      color: 'text-pink-600',
      value: abbreviatedSubject || 'None',
      title: 'Subject',
      subtitle: mostPracticedSubject !== 'None' ? `Practiced ${abbreviatedSubject} ${mostPracticedCount} times` : 'No subject data available',
    },
    {
      icon: Target,
      color: 'text-red-600',
      value: `${accuracy}%`,
      title: 'Accuracy',
      subtitle: `Aced ${totalCorrect} of ${totalAttempts} attempts`,
    },
    {
      icon: CircleHelp,
      color: 'text-yellow-600',
      value: `${attemptPercentage}%`,
      title: 'Attempts',
      subtitle: `${totalAttempts} attempts of ${totalQuestions} questions in total`,
    },
    {
      icon: Rabbit,
      color: 'text-orange-600',
      value: bestTimeFormatted,
      title: 'Time',
      subtitle: `${bestTimePractice?.totalAttempts || 0} attempts, scored ${bestTimePractice?.totalScore || 0} in ${bestTimeFormatted}`,
    },
    {
      icon: Flame,
      color: 'text-red-600',
      value: `${streak} days`,
      title: 'Streak',
      subtitle: `Practiced for ${streak} consecutive days`,
    },
    {
      icon: Watch,
      color: 'text-purple-600',
      value: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`,
      title: 'Time on Practice',
      subtitle: `Practiced for ${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s in total`,
    },
  ];

  return (
    <div className="w-full p-6 rounded-xl bg-muted/50 grid grid-cols-2 gap-6 text-sm">
      {trackerItems.map((item, index) => (
        <Stat key={index} icon={item.icon} color={item.color} value={item.value} title={item.title} subtitle={item.subtitle} />
      ))}
    </div>
  );
}
