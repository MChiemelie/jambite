type BaseQuestion = {
  id: number;
  question: string;
  answer: string;
};

export type Question = BaseQuestion & {
  option: Record<string, string>;
  solution: string;
  examtype: string;
  examyear: string;
  questionNub?: number | null;
  hasPassage?: number;
  category?: string;
  image?: string;
  section?: string;
};

export type Questions = {
  questions: Record<string, Question[]> | Question[];
};

export type ReportQuestionProps = {
  subject: string;
  questionId: number;
  fullName?: string;
  onReportSubmitted?: () => void;
};
