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

type Questions = {
  questions: Record<string, Question[]> | Question[];
};
