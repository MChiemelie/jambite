'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles';
import { fetchPerformanceData } from '@/utilities/supabase';
import { Session } from '@supabase/auth-helpers-nextjs';

export default function Performance({ session }: { session: Session | null }) {
  const [bestScoreData, setBestScoreData] = useState(null);
  const [leastTimeTaken, setLeastTimeTaken] = useState(null);
  const [leastTimeSubject, setLeastTimeSubject] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [highestAttemptsSubject, setHighestAttemptsSubject] = useState(null);
  const [correctAnswersPercentage, setCorrectAnswersPercentage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchPerformanceData(session);
        
        setBestScoreData(data.bestScore);
        setLeastTimeTaken(data.leastTimeTaken);
        setLeastTimeSubject(data.leastTimeSubject);
        setAverageScore(data.averageScore);
        setTotalAttempts(data.totalAttempts);
        setHighestAttemptsSubject(data.highestAttemptsSubject);
        setCorrectAnswersPercentage(data.correctAnswersPercentage);
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  return (
    <div className={`${styles.blurcard} p-4`}>
      <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-sky-100 text-accent-1 mb-4">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      </div>
      <h2 className="text-lg font-medium title-font mb-2">Performance</h2>
      {loading && <p className={styles.fontsizesm}>Getting your perfomance data</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <p className="text-sm">Best Score: {' '} {bestScoreData ? `${bestScoreData.score}/40 (${bestScoreData.subject})` : 'N/A'}{' '}
          <br />
          BestTime: {' '} {leastTimeTaken !== null ? `${leastTimeTaken} (${leastTimeSubject})` : 'N/A'}{' '}
          <br />
          Average Score: {averageScore ?? 0}
          <br />
          Total Quiz Attempts: {totalAttempts}
          <br />
          Highest Attempts Subject: {highestAttemptsSubject || 'N/A'}
          <br />
          Correct Answers Percentage: {correctAnswersPercentage || 'N/A'}%
        </p>
      )}
    </div >
  );
}