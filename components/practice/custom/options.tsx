'use client';

import parse from 'html-react-parser';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKey } from 'react-use';
import {
  useCurrentQuestion,
  usePracticeActions,
  useQuestions,
  useSelectedAnswers,
  useSelectedSubject,
  useSubmitted
} from '@/stores/practice';
import type { Question } from '@/types';

export default function Options() {
  const questions = useQuestions();
  const submitted = useSubmitted();
  const currentQuestion = useCurrentQuestion();
  const selectedSubject = useSelectedSubject();
  const selectedAnswers = useSelectedAnswers();

  const { setUnattemptedQuestions, selectAnswer } = usePracticeActions();

  const [showKeyboardTip, setShowKeyboardTip] = useState(true);

  useEffect(() => {
    try {
      const hidden = localStorage.getItem('kbdTipHidden') === 'true';
      setShowKeyboardTip(!hidden);
    } catch {
      /* ignore */
    }
  }, []);

  const hideKeyboardTip = useCallback(() => {
    try {
      localStorage.setItem('kbdTipHidden', 'true');
    } catch {
      /* ignore */
    }
    setShowKeyboardTip(false);
  }, []);

  const currentQuestionsData = useMemo(
    () => questions[selectedSubject] ?? [],
    [questions, selectedSubject]
  );

  const currentQuestionData =
    currentQuestionsData[currentQuestion] || ({} as Question);

  if (process.env.NODE_ENV !== 'production') {
    console.debug('Options — currentQuestionData', { currentQuestionData });
  }

  const option = useMemo(() => {
    const raw = (currentQuestionData as any)?.option;
    if (!raw || typeof raw !== 'object') return null;
    const normalized = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [String(k).toUpperCase(), v])
    ) as Record<string, string>;

    const filtered: Record<string, string> = {};
    ['A', 'B', 'C', 'D'].forEach((k) => {
      if (normalized[k]) filtered[k] = normalized[k];
    });
    return Object.keys(filtered).length ? filtered : null;
  }, [currentQuestionData]);

  const currentQuestionId = (currentQuestionData as any)?.id as number;
  const questionText = (currentQuestionData as any)?.question ?? '';
  const selectedOption = currentQuestionId
    ? (selectedAnswers[currentQuestionId] ?? null)
    : null;

  const handleAnswerSelection = useCallback(
    (qid: number | string | undefined, opt: string) => {
      if (qid == null) return;
      selectAnswer({
        questionId: qid as any,
        selectedOption: opt,
        subject: selectedSubject
      });
      setUnattemptedQuestions(selectedSubject, qid as any);
    },
    [selectAnswer, setUnattemptedQuestions, selectedSubject]
  );

  const isTyping = () => {
    const el = document?.activeElement as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName;
    if (!tag) return false;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return !!el.isContentEditable;
  };

  const makeHandler = useCallback(
    (key: string) => () => {
      if (submitted || !option || !option[key]) return;
      handleAnswerSelection(currentQuestionId, key);
    },
    [submitted, option, handleAnswerSelection, currentQuestionId]
  );

  useKey(
    (e: KeyboardEvent) => !isTyping() && e.key.toLowerCase() === 'a',
    makeHandler('A'),
    undefined,
    [makeHandler]
  );
  useKey(
    (e: KeyboardEvent) => !isTyping() && e.key.toLowerCase() === 'b',
    makeHandler('B'),
    undefined,
    [makeHandler]
  );
  useKey(
    (e: KeyboardEvent) => !isTyping() && e.key.toLowerCase() === 'c',
    makeHandler('C'),
    undefined,
    [makeHandler]
  );
  useKey(
    (e: KeyboardEvent) => !isTyping() && e.key.toLowerCase() === 'd',
    makeHandler('D'),
    undefined,
    [makeHandler]
  );

  if (!option) {
    return (
      <div className="rounded bg-red-50 p-4 text-sm text-red-600">
        No options available for this question. Check console for{' '}
        <code>currentQuestionData</code>.
      </div>
    );
  }

  const order = ['A', 'B', 'C', 'D'];

  return (
    <fieldset className="flex flex-col gap-2 border-0">
      <legend className="sr-only">
        Options for question: {parse(questionText)}
      </legend>

      <ol type="A" className="flex flex-col gap-2">
        {order.map((key) => {
          const value = option[key];
          if (!value) return null;
          const id = `q_${String(currentQuestionId)}_opt_${key}`;
          return (
            <li key={key}>
              <label
                htmlFor={id}
                className="flex cursor-pointer items-center gap-4"
              >
                <input
                  id={id}
                  className="h-4 w-4 appearance-none rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-200 md:border-4"
                  type="radio"
                  name={`question_${String(currentQuestionId)}`}
                  value={key}
                  checked={selectedOption === key}
                  onChange={() => handleAnswerSelection(currentQuestionId, key)}
                  disabled={submitted}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-meduim uppercase">{key}.</span>
                    <div className="prose max-w-none">{parse(value)}</div>
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}
