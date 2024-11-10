'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import styles from '@/styles';
import { fetchPerformanceData } from '@/services/supabase';
import { Session } from '@supabase/auth-helpers-nextjs';
import { Timer } from 'lucide-react';

// Registering required chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Time({ session }: { session: Session | null }) {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch performance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPerformanceData(session);
        setPerformanceData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch performance data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Prepare data for the chart
  const chartData = {
    labels: performanceData?.leastTime?.map((item: any) => item.subject) || [],
    datasets: [
      {
        label: 'Best Time',
        data:
          performanceData?.leastTime?.map((item: any) => {
            const bestScore = performanceData.topScores.find((scoreItem: any) => scoreItem.subject === item.subject)?.score || 0;
            return { x: item.subject, y: bestScore };
          }) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`${styles.blurcard} p-4`}>
      <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-sky-100 text-accent-1 mb-4">
        <Timer />
      </div>
      <h2 className="text-lg font-medium title-font mb-2">Best Time</h2>
      {loading && <p className={styles.fontsizesm}>Loading your performance data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && performanceData?.leastTime && (
        <div>
          <Bar
            data={chartData}
            options={{
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw}`,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Subject',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Score',
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
