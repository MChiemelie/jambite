'use client';

import { useCurrentQuestion, useQuestions, useSelectedSubject } from '@/stores/practice';
import { Question } from '@/types';
import Image from 'next/image';
import { useMemo } from 'react';
import parse from 'html-react-parser';

export default function QuestionSection() {
  const currentQuestion = useCurrentQuestion();
  const questions = useQuestions();
  const selectedSubject = useSelectedSubject();

  const currentQuestionsData = useMemo(() => questions[selectedSubject] ?? [], [questions, selectedSubject]);

  const currentQuestionData = currentQuestionsData[currentQuestion] || ({} as Question);
  const { question, image, section } = currentQuestionData;

  return (
    <div className="flex flex-col gap-4">
      {image && <Image src={image} alt="Question illustration" width={500} height={500} className="mx-auto max-w-md" />}
      {section && <section className="max-h-64 overflow-y-auto">{parse(section.charAt(0).toUpperCase() + section.slice(1))}</section>}
      <p>{parse(question)}</p>
    </div>
  );
}
