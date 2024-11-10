import styles from '@/styles';

export default function PerformanceMetrics({ totalAttempts, accuracy, speed, avgTimePerQuiz, highestScore, avgScore, completionRate }) {
  return (
    <div className={`${styles.blurcard} p-4`}>
      <h2 className="text-lg font-medium title-font mb-4">Metrics</h2>
      <ul className="list-disc ml-5 space-y-2">
        <li>Total Attempts: {totalAttempts}</li>
        <li>Accuracy: {accuracy}%</li>
        <li>Speed: {speed} secs per question</li>
        <li>Average Time per Quiz: {avgTimePerQuiz} mins</li>
        <li>Highest Score: {highestScore}</li>
        <li>Average Score: {avgScore}</li>
        <li>Completion Rate: {completionRate}%</li>
      </ul>
    </div>
  );
}