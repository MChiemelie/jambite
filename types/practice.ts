import { Question } from './question';
import { User } from './user';

export type PracticeStore = {
  currentQuestion: number;
  selectedAnswers: { [key: number]: string };
  aiReviews: Record<string, Record<number, string>>;
  generatingForQuestionId: number | null;
  attemptedQuestions: { [key: number]: boolean };
  totalNumberAttempted: number;
  numberAttempted: { [subject: string]: number };
  unattemptedQuestions: { [subject: string]: number[] };
  submitted: boolean;
  countdown: number;
  score: number;
  subjectScores: { [subject: string]: number };
  resultsFeedback: { [key: number]: { type: string; userAnswer?: string; correctAnswer: string } };
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
  setScore: (n: number) => void;
  setSubjectScores: (scores: Record<string, number>) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setCurrentQuestion: (n: number) => void;
  setSubmitted: (f: boolean) => void;
  timeEnded: () => void;
  setCountdown: (n: number) => void;
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

export type PracticeData = {
  practiceId: string;
  userId: string;
  timestamp: string;
  duration: number;
  feedback: string;
  subjects: SubjectData[] | string;
  completed: boolean;
  totalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  totalAttempts: number;
};

export type postPerformanceData = {
  performanceId: string;
  userId: string;
  correct: number;
  attempts: number;
  totalSubjectQuestions: number;
  subject: string;
  score: number;
  practiceId?: string;
  createdAt: string;
};

export type SubjectData = {
  performanceId: string;
  practiceId: string;
  subject: string;
  totalQuestions: number;
  attempts: number;
  correct: number;
  score: number;
};

export type AIReview = {
  image: string;
  section: string;
  question: string;
  option: Record<string, string>;
  selectedOption: string;
  answer: string;
};



// export type SubjectPerformance = {
//   practiceId: string;
//   timestamp: string;
//   duration: number;
//   feedback: string;
//   subjects: string;
//   completed: boolean;
//   totalScore: number;
//   totalCorrect: number;
//   totalQuestions: number;
//   userId: string | undefined;
//   totalAttempts: number;
//   performanceId: string;
// };
// export type PerformanceEntry = {
//   performanceId: string;
//   userId: string;
//   correct: number;
//   attempts: number;
//   totalSubjectQuestions: number;
//   subject: string;
//   score: number;
//   practiceId: string;
//   createdAt: string;
// };

// export type PostPerformanceDataInput = {
//   performanceId: string;
//   practiceId: string;
//   subject: string;
//   correct: number;
//   attempts: number;
//   totalSubjectQuestions: number;
//   score: number;
//   createdAt: string;
// };
