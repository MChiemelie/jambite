export type Practices = {
  practiceId: string;
  timestamp: number;
  duration: number;
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  totalScore: number;
  userId: string;
  createdAt: string;
};

export type Performances = {
  performanceId: string;
  userId: string;
  correct: number;
  attempts: number;
  totalSubjectQuestions: number;
  subject: string;
  score: number;
  practiceId: string;
  createdAt: string;
};

export type PerformanceAnalytics = {
  totalCorrect: number;
  totalAttempts: number;
  subjects: {
    subject: string;
    totalQuestions: number;
    totalAttempts: number;
    score: number;
  }[];
};

export type PracticeAnalytics = {
  totalDuration: number;
  totalQuestions: number;
  totalCorrect: number;
  totalScore: number;
  totalIncorrect: number;
  totalAttempts: number;
};

export type AcumenProps = {
  data: { subject: string; correct: number; incorrect: number }[];
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
