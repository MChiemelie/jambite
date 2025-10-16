import { setQuestions } from '@/helpers/practice';
import type { AppwriteDoc, AppwriteList } from './appwrite';
import type { Question } from './question';
import type { User } from './user';

export type PracticeStore = {
  initialCountdown: number;
  duration: number;
  currentQuestion: number;
  selectedAnswers: { [key: number]: string };
  aiReviews: Record<string, Record<number, string>>;
  attemptedQuestions: { [key: number]: boolean };
  totalNumberAttempted: number;
  totalQuestions: number;
  numberAttempted: { [subject: string]: number };
  unattemptedQuestions: { [subject: string]: number[] };
  submitted: boolean;
  countdown: number;
  totalCorrect: number;
  totalScore: number;
  subjectScores: { [subject: string]: number };
  resultsFeedback: {
    [key: number]: { type: string; userAnswer?: string; correctAnswer: string };
  };
  timeEnd: boolean;
  submitPopup: boolean;
  selectedSubjects: string[];
  selectedSubjectsParameters: string[];
  questions: { [subject: string]: Question[] };
  loading: boolean;
  error: string | null;
  pendingReview: { subject: string; questionId: number } | null;
  user: User | null;
  selectedSubject: string;
  hasHydrated: boolean;
  fetchData: boolean;
};

export type PracticeActions = {
  setUser: (u: User) => void;
  setSelectedSubjects: (s: string[]) => void;
  setSelectedSubjectsParameters: (p: string[]) => void;
  setTotalCorrect: (n: number) => void;
  setDuration: (n: number) => void;
  setTotalScore: (n: number) => void;
  setSubjectScores: (scores: Record<string, number>) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setCurrentQuestion: (n: number) => void;
  setSubmitted: (f: boolean) => void;
  timeEnded: () => Promise<void>; // Changed from void to Promise<void>
  setCountdown: (n: number | ((prev: number) => number)) => void; // Added functional update support
  setTotalQuestions: (n: number) => void;
  setResultsFeedback: (fb: PracticeStore['resultsFeedback']) => void;
  setSubmitPopup: (f?: boolean) => void;
  selectAnswer: (opts: { questionId: number; selectedOption: string; subject: string }) => void;
  setAiReview: (opts: { subject: string; questionId: number; review: string }) => void;
  setQuestions: (qs: Record<string, Question[]>) => void;
  reset: () => void;
  setError: (msg: string) => void;
  clearError: () => void;
  setUnattemptedQuestions: (subject: string, questionId: number) => void;
  submitPractice: () => Promise<void>;
  setPendingReview: (pr: { subject: string; questionId: number } | null) => void;
  setSelectedSubject: (subject: string) => void;
  setHydrated: (v: boolean) => void;
  setFetchData: (v: boolean) => void;
};

// ============ Practices ============

export interface Practice {
  timestamp: string;
  duration: number;
  feedback?: string | null;
  completed?: boolean;
  totalScore: number;
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  userId: string;
  createdAt: string;
}

export type CreatePractice = Omit<Practice, keyof AppwriteDoc | 'createdAt' | 'feedback' | 'completed'> & {
  feedback?: string | null;
  completed?: boolean;
};

type Practices = AppwriteList<Practice>;

// ============ Performances ============

export interface Performance {
  userId: string;
  correct: number;
  attempts: number;
  totalQuestions: number;
  subject: string;
  score: number;
  practiceId: string;
  createdAt: string;
}

export type CreatePerformance = Omit<Performance, keyof AppwriteDoc | 'createdAt'>;

type Performances = AppwriteList<Performance>;

// ============ AI Review ============

export interface AIReview {
  image: string;
  section: string;
  question: string;
  option: Record<string, string>;
  selectedOption: string;
  answer: string;
}
