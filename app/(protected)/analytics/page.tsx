import { AnalyticsGrid } from '@/components/analytics';
import { Status } from '@/components/custom';
import { calculateAnalytics } from '@/helpers/analytics';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const {
    practiceAnalytics,
    accuracyData,
    subjectsScoreData,
    subjectsAttemptsData,
    acumenData,
    durationData
  } = await calculateAnalytics();

  const noData =
    !practiceAnalytics ||
    !accuracyData?.length ||
    !subjectsScoreData?.length ||
    !subjectsAttemptsData?.length ||
    !acumenData?.length;

  if (noData) {
    return (
      <Status
        image="/assets/analytics.svg"
        desc1="You have not practiced yet."
        desc2="There is nothing to analyse."
      />
    );
  }

  return (
    <section className="flex w-full flex-col gap-10 p-2 md:p-4 lg:p-8">
      <figure className="quote text-center">
        <blockquote>
          <span className="text-2xl">📊</span>
          <h1 className="text-lg font-bold italic">
            “Above all else, show the data.”
          </h1>
        </blockquote>
        <figcaption>
          <cite>
            — Edward R. Tufte,{' '}
            <em>The Visual Display of Quantitative Information</em>
          </cite>
        </figcaption>
      </figure>
      <AnalyticsGrid
        practiceAnalytics={practiceAnalytics}
        accuracyData={accuracyData}
        subjectsScoreData={subjectsScoreData}
        subjectsAttemptsData={subjectsAttemptsData}
        acumenData={acumenData}
        durationData={durationData}
      />
    </section>
  );
}
