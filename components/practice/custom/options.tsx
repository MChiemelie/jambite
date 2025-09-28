import { useCallback, useMemo } from 'react';
import { useCurrentQuestion, usePracticeActions, useQuestions, useSelectedAnswers, useSelectedSubject, useSubmitted } from '@/stores/practice';
import { Question } from '@/types';
import parse from 'html-react-parser';

export default function Options() {
  const questions = useQuestions();
  const submitted = useSubmitted();
  const currentQuestion = useCurrentQuestion();
  const selectedSubject = useSelectedSubject();
  const selectedAnswers = useSelectedAnswers();

  const { setUnattemptedQuestions, selectAnswer } = usePracticeActions();

  const currentQuestionsData = useMemo(() => questions[selectedSubject] ?? [], [questions, selectedSubject]);

  const currentQuestionData = currentQuestionsData[currentQuestion] || ({} as Question);
  const { id: currentQuestionId, option, question } = currentQuestionData;
  const selectedOption = selectedAnswers[currentQuestionId] || null;

  const handleAnswerSelection = useCallback(
    (qid: number, opt: string) => {
      selectAnswer({
        questionId: qid,
        selectedOption: opt,
        subject: selectedSubject,
      });
      setUnattemptedQuestions(selectedSubject, qid);
    },
    [selectAnswer, setUnattemptedQuestions, selectedSubject]
  );

  if (!option) return null;

  return (
    <fieldset className="flex flex-col gap-2 border-0">
      <legend className="sr-only">Options for question: {parse(question || '')}</legend>
      <ol type="A" className="flex flex-col gap-2">
        {Object.entries(option as { [key: string]: string })
          .slice(0, 4)
          .map(([key, value]) => (
            <li key={key}>
              <label className="flex items-center gap-4">
                <input className="appearance-none w-4 h-4 border-2 md:border-4 border-gray-300 rounded-full checked:bg-blue-200 checked:border-blue-600" type="radio" name={`question_${currentQuestionId}`} value={key} checked={selectedOption === key} onChange={() => handleAnswerSelection(currentQuestionId, key)} disabled={submitted} />
                <p className="uppercase">{key}.</p>
                <p>{parse(value || '')}</p>
              </label>
            </li>
          ))}
      </ol>
    </fieldset>
  );
}
