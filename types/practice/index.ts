export type Question = {
  id: number;
  question: string;
  option: Record<string, string>;
  answer: string;
  solution: string;
  examtype: string;
  examyear: string;
  questionNub?: null | number;
  hasPassage?: number;
  category?: string;
};

export type QuestionsProps = {
  subject: string;
  data: Question[];
};

export type Practice = {
  currentQuestion: number;
  selectedAnswers: { [key: number]: string };
  attemptedQuestions: { [key: number]: boolean };
  totalNumberAttempted: number;
  numberAttempted: { [subject: string]: number };
  unattemptedQuestions: { [subject: string]: number[] };
  submitted: boolean;
  countdown: number;
  score: number;
  subjectScores: { [subject: string]: number };
  resultsFeedback: { [key: number]: string };
  timeEnd: boolean;
  submitPopup: boolean;
  selectedSubjects: string[];
  selectedSubjectsParameters: string[];
  questions: { [subject: string]: Question[] };
  loading: boolean;
  error: string | null;
  user: any | null;
};

