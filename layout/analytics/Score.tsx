'use client';

import { useEffect, useState, Suspense } from 'react';
import styles from '@/styles';
import { Percent } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { fetchPerformanceData } from '@/services/supabase';
import { ScoreProps, PerformanceData } from "@/types"
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function Score({ session }: ScoreProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPerformanceData(session);
        console.log(data);
        setPerformanceData(data);
      } catch (err) {
        Error('Failed to fetch performance data.');
      } finally {
        // console.clear();
      }
    };

    fetchData();
  }, [session]);

  const prepareChartData = () => {
    if (!performanceData) return { labels: [], datasets: [] };

    const subjects = performanceData.mostAttemptedSubjects.map(item => item.subject);
    const attempts = performanceData.mostAttemptedSubjects.map(item => item.attempts);
    const scores = performanceData.mostAttemptedSubjects.map(subject => {
      const filteredScores = performanceData.topScores.filter(scoreItem => scoreItem.subject === subject.subject);
      const averageScore = filteredScores.reduce((sum, scoreItem) => sum + scoreItem.score, 0) / filteredScores.length;
      return averageScore || 0;
    });

    // Find the highest score for each subject
    const highestScores = performanceData.mostAttemptedSubjects.map(subject => {
      const filteredScores = performanceData.topScores.filter(scoreItem => scoreItem.subject === subject.subject);
      const highestScore = Math.max(...filteredScores.map(scoreItem => scoreItem.score), 0);
      return highestScore;
    });

    return {
      labels: subjects,
      datasets: [
        {
          label: 'Average Score',
          data: scores,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth: 1,
        },
        {
          label: 'Highest Score',
          data: highestScores,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  return (
    <div className={`${styles.blurcard} p-4`}>
      <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-sky-100 text-accent-1 mb-4">
        <Percent />
      </div>
      <h2 className="text-lg font-medium title-font mb-2">Scores</h2>
        <Suspense fallback="Getting Your Score Metrics">
          <Bar data={chartData} />
        </Suspense>
    </div>
  );
}