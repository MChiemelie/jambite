import { Question } from './question';
import { User } from './user';

export type Practice = {
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
  user: User;
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

export type SubjectData = {
  subject: string;
  totalQuestions: number;
  attempts: number;
  correct: number;
  score: number;
};

export type Performance = {
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

export type Popup = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  buttonText: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
  disabled?: boolean;
  className?: string;
  isSubmitted?: boolean;
};

export type CandidateDetails = {
  subject: string;
};

export type ExamTimerProps = {
  onTimeEnd: () => void;
  submitted: boolean;
};

export type AIReview = {
  image: string;
  section: string;
  question: string;
  option: Record<string, string>;
  selectedOption: string;
  answer: string;
};
