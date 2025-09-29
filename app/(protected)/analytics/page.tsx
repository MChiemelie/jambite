import { Accuracy, Attempts, Duration, Precision, Scores, Subjects } from '@/components/analytics';
import { Status } from '@/components/custom';
import { calculateAnalytics } from '@/helpers/analytics';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const { practiceAnalytics, accuracyData, subjectsScoreData, subjectsAttemptsData, acumenData, durationData } = await calculateAnalytics();

  const noData = !practiceAnalytics || !accuracyData?.length || !subjectsScoreData?.length || !subjectsAttemptsData?.length || !acumenData?.length;

  if (noData) {
    return <Status image="/assets/analytics.svg" desc1="You have not practiced yet." desc2="There is nothing to analyse." />;
  }

  return (
    <section className="p-2 md:p-4 lg:p-8 w-full">
      <figure className="quote text-center mb-10">
        <blockquote>
          <h1 className="font-bold italic text-lg">“Above all else, show the data.”</h1>
        </blockquote>
        <figcaption>
          <cite>
            — Edward R. Tufte, <em>The Visual Display of Quantitative Information</em>
          </cite>
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        <Accuracy data={accuracyData} />

        <Attempts totalAttempts={practiceAnalytics?.totalAttempts} totalQuestions={practiceAnalytics?.totalQuestions} />

        <Subjects data={subjectsAttemptsData} />

        <Scores data={subjectsScoreData} />

        <Duration data={durationData} />

        <Precision data={acumenData} />
      </div>
    </section>
  );
}
