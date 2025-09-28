import { Practice } from './practice';

export type AnalyticsResult = {
  practiceAnalytics: PracticeAnalytics;
  performanceAnalytics: PerformanceAnalytics;
  accuracyData: AccuracyProps['data'];
  subjectsScoreData: ScoresProps['data'];
  subjectsAttemptsData: SubjectsProps['data'];
  acumenData: AcumenProps['data'];
  durationData: DurationProps;
  mostPracticed: MostPracticedSubjectResult;
  bestPractice: Practice;
  highestScore: Practice;
};

export type PerformanceAnalytics = {
  totalCorrect: number;
  totalAttempts: number;
  subjects: {
    subject: string;
    totalQuestions: number;
    totalAttempts: number;
    totalCorrect: number;
    score: number;
  }[];
};

export type PracticeAnalytics = {
  totalPractices: number;
  totalDuration: number;
  totalQuestions: number;
  totalCorrect: number;
  totalScore: number;
  totalIncorrect: number;
  totalAttempts: number;
};

export type QuestionsAttemptsProps = {
  totalAttempts: number;
  totalQuestions: number;
};

export type SubjectAttempts = {
  subject: string;
  attempts: number;
};

export type ChartData = {
  subject: string;
  attempts: number;
  fill: string;
};

export type AccuracyProps = {
  data: Array<{
    correct: number;
    incorrect: number;
  }>;
};

type AttemptsProps = {
  totalAttempts: number;
  totalQuestions: number;
};

export type SubjectsProps = {
  data: Array<{
    subject: string;
    attempts: number;
  }>;
};

export type ScoresProps = {
  data: Array<{
    subject: string;
    score: number;
  }>;
};

type DurationItem = {
  metric: string;
  score: number;
  duration: number;
};

export type DurationProps = DurationItem[];

export type AcumenProps = {
  data: Array<{
    subject: string;
    correct: number;
    incorrect: number;
  }>;
};

export type MostPracticedSubjectResult = {
  mostPracticedSubject: string;
  mostPracticedCount: number;
};

export type FullSubject = 'Use of English' | 'Mathematics' | 'Commerce' | 'Accounting' | 'Biology' | 'Physics' | 'Chemistry' | 'Lit. In English' | 'Government' | 'Christian Rel. Know' | 'Geography' | 'Economics' | 'Islamic Rel. Know' | 'Civic Education' | 'History';
