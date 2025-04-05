import { Book, CheckCheck, CircleHelp, Flame, FlaskConical, LaptopMinimalCheck, Target, Watch } from 'lucide-react';
import { getUserData } from '@/services';
import { getPerformance, getPractice } from '@/services/practice';
import { abbreviateSubject, calculateStreak, getMostPracticedSubject } from '@/utilities';
import { Card } from '.';

export default async function Tracker() {
  const [performanceData, practiceData] = await Promise.all([getPerformance(), getPractice()]);
  const user = await getUserData();

  const totalPractices = practiceData.length;
  const totalCorrect = performanceData.reduce((acc, p) => acc + p.correct, 0);
  const totalQuestions = practiceData.reduce((acc, p) => acc + Number(p.totalQuestions), 0);
  const totalAttempts = practiceData.reduce((acc, p) => acc + Number(p.totalAttempts), 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const totalDuration = practiceData.reduce((acc, p) => acc + p.duration, 0);
  const attemptPercentage = totalQuestions > 0 ? Math.round((totalAttempts / totalQuestions) * 100) : 0;
  const bestPractice = practiceData.reduce((best, curr) => (curr.totalScore > best.totalScore ? curr : best), {
    totalScore: 0,
  });
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
      subtitle: `Successfully completed`,
    },
    {
      icon: CheckCheck,
      color: 'text-green-600',
      value: highestScore.toString(),
      title: 'Score',
      subtitle: `${bestSubject} (${bestScore})`,
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
      color: 'text-yellow-400',
      value: `${attemptPercentage}%`,
      title: 'Attempts',
      subtitle: `Did ${totalAttempts} of ${totalQuestions} ques.`,
    },
    {
      icon: FlaskConical,
      color: 'text-orange-600',
      value: user?.trials,
      title: 'Trials',
      subtitle: `Trial(s) left`,
    },
    {
      icon: Flame,
      color: 'text-red-600',
      value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
      title: 'Streak',
      subtitle: `Longest: ${streak} ${streak >= 1 ? 'day' : 'days'}`,
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-full w-fit md:w-full place-items-center mx-auto">
      {trackerItems.map((card, index) => (
        <Card key={index} title={card.title} subtitle={card.subtitle} value={card.value} icon={<card.icon className={`w-5 h-5 ${card.color} ${card.icon === Flame ? 'fill-current' : ''}`} />} />
      ))}
    </div>
  );
}
