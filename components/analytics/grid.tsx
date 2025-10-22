'use client';

import React, { useMemo } from 'react';
import {
  Accuracy,
  Attempts,
  Duration,
  Precision,
  Scores,
  Subjects
} from '@/components/analytics';
import type {
  AccuracyProps,
  AcumenProps,
  DurationProps,
  PracticeAnalytics,
  ScoresProps,
  SubjectsProps
} from '@/types';

type Props = {
  practiceAnalytics: PracticeAnalytics;
  accuracyData: AccuracyProps['data'];
  subjectsScoreData: ScoresProps['data'];
  subjectsAttemptsData: SubjectsProps['data'];
  acumenData: AcumenProps['data'];
  durationData: DurationProps;
};

function AnalyticsGridComponent({
  practiceAnalytics,
  accuracyData,
  subjectsScoreData,
  subjectsAttemptsData,
  acumenData,
  durationData
}: Props) {
  const memoAccuracy = useMemo(() => accuracyData, [accuracyData]);
  const memoSubjectsScore = useMemo(
    () => subjectsScoreData,
    [subjectsScoreData]
  );
  const memoSubjectsAttempts = useMemo(
    () => subjectsAttemptsData,
    [subjectsAttemptsData]
  );
  const memoAcumen = useMemo(() => acumenData, [acumenData]);
  const memoDuration = useMemo(() => durationData, [durationData]);

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Accuracy data={memoAccuracy} />

      <Attempts
        totalAttempts={practiceAnalytics?.totalAttempts}
        totalQuestions={practiceAnalytics?.totalQuestions}
      />

      <Subjects data={memoSubjectsAttempts} />

      <Scores data={memoSubjectsScore} />

      <Duration data={memoDuration} />

      <Precision data={memoAcumen} />
    </div>
  );
}

export default React.memo(AnalyticsGridComponent);
