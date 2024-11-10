'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { ExamTimer, SubmitButton } from '@/layout/practice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setCurrentQuestion, selectAnswer, nextQuestion, previousQuestion, timeEnded, setSubjectScores, clearUser, setUser } from '@/store/practiceSlice';
import { updateUnattemptedQuestions, submitPractice, calculateAndSetScores } from '@/store/practiceThunks';
import Image from 'next/image';
import { Candidate } from './';
import parse from 'html-react-parser';
import { subjectPathMap } from '@/subjects';

interface PracticeProps {
  questions: Record<string, any[]>;
}

export default function Practice({ questions }: PracticeProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestion, selectedAnswers, submitted, countdown, score, selectedSubjects, numberAttempted, totalNumberAttempted, resultsFeedback, timeEnd, unattemptedQuestions, subjectScores } = useSelector((state: RootState) => state.practice);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Use of English');

  useEffect(() => {
    if (timeEnd) {
      setIsPopupOpen(true);
    }
  }, [timeEnd]);

  const currentQuestionsData = useMemo(() => {
    return selectedSubject ? questions[selectedSubject] || [] : [];
  }, [questions, selectedSubject]);

  const currentQuestionData = useMemo(() => {
    if (!currentQuestionsData.length) {
      return {};
    }
    return currentQuestionsData[currentQuestion] || {};
  }, [currentQuestionsData, currentQuestion]);

  console.log(countdown);

  const { id: currentQuestionId, question, option, image, solution, section, answer } = currentQuestionData as any;
  const selectedOption = selectedAnswers[currentQuestionId ?? -1] || null;
  const feedbackMessage = resultsFeedback[currentQuestionId ?? -1] || null;
  const questionNumber = currentQuestion + 1;
  const totalQuestions = useMemo(() => Object.keys(questions).reduce((acc, subject) => acc + questions[subject].length, 0), [questions]);

  const popupTitle = timeEnd ? 'Your Time is up!' : submitted ? 'Exam Submitted Successfully!' : 'Confirm Submission';
  const popupDescript = timeEnd || submitted ? 'Congratulations! Your exam has been submitted successfully!' : 'Are you sure you want to end the exam?';

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    if (questions[subject]) {
      const unattempted = unattemptedQuestions[subject] || [];
      const startQuestionIndex = questions[subject].findIndex((q) => q.id === unattempted[0]);
      dispatch(setCurrentQuestion(startQuestionIndex !== -1 ? startQuestionIndex : 0));
    }
  };

  const handleAnswerSelection = useCallback(
    (questionId: number, selectedOption: string) => {
      dispatch(selectAnswer({ questionId, selectedOption, subject: selectedSubject }));
      dispatch(updateUnattemptedQuestions({ subject: selectedSubject!, questionId }));
    },
    [dispatch, selectedSubject]
  );

  const handleSubmit = useCallback(async () => {
    if (!submitted) {
      await dispatch(submitPractice());
      setIsPopupOpen(true);
    }
  }, [submitted, dispatch]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionsData.length > 0 && currentQuestion < currentQuestionsData.length - 1) {
      dispatch(nextQuestion());
    }
  }, [currentQuestion, dispatch, currentQuestionsData]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      dispatch(previousQuestion());
    }
  }, [currentQuestion, dispatch]);

  const handlePaginationClick = useCallback(
    (questionIndex: number) => {
      dispatch(setCurrentQuestion(questionIndex));
    },
    [dispatch]
  );

  const handleTimeEnd = useCallback(() => {
    if (!submitted) {
      dispatch(timeEnded());
    }
  }, [submitted, dispatch]);

  return (
    <div>
      <div className="text-white p-3 flex justify-between font-semibold text-sm">
        <div className="flex items-center space-x-3 uppercase">
          {questions && selectedSubject ? (
            <div className="flex space-x-3">
              {Object.keys(questions).map((subject) => (
                <span key={subject} onClick={() => handleSubjectChange(subject)} className={`p-2 rounded-sm cursor-pointer ${selectedSubject === subject ? 'text-accent-2 border-2 border-accent-2' : 'bg-accent-2'}`}>
                  {subjectPathMap[subject] || subject}
                </span>
              ))}
              <span className="bg-accent-2 p-2 rounded-sm cursor-pointer">
                <Calculator />
              </span>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="flex space-x-3 items-center">
          <ExamTimer initialCountdown={countdown} onTimeEnd={handleTimeEnd} submitted={submitted} />
          <SubmitButton isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} buttonText={submitted || timeEnd ? 'Submitted' : 'End Exam'} disabled={submitted || timeEnd} title={popupTitle} description={popupDescript} isSubmitted={submitted} onSubmit={handleSubmit} className={`p-2 rounded-sm w-60% text-white ${submitted || timeEnd ? 'bg-gray-400' : 'bg-red-700'}`}>
            {submitted || timeEnd ? (
              <div className="text-center text-lg">
                <p>
                  Total Score: {score} out of {totalQuestions} ({((score / totalQuestions) * 100).toFixed()}%
                </p>
                <p>
                  Total Attempts: {totalNumberAttempted} out of {totalQuestions} ({((totalNumberAttempted / totalQuestions) * 100).toFixed()}%)
                </p>
                <p>
                  Duration: {Math.floor((1200 - countdown) / 60)} minutes and {(1200 - countdown) % 60} seconds
                </p>

                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Score</th>
                      <th className="px-4 py-2">%</th>
                      <th className="px-4 py-2">Attempts</th>
                      <th className="px-4 py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(questions).map((subject) => (
                      <tr key={subject}>
                        <td className="border px-4 py-2 font-semibold">{subject}</td>
                        <td className="border px-4 py-2">{subjectScores[subject] || 0}</td>
                        <td className="border px-4 py-2">{subjectScores[subject] ? `${((subjectScores[subject] / questions[subject].length) * 100).toFixed()}%` : '0%'}</td>
                        <td className="border px-4 py-2">
                          {numberAttempted[subject] || 0}/{questions[subject].length}
                        </td>
                        <td className="border px-4 py-2">{numberAttempted[subject] ? `${((numberAttempted[subject] / questions[subject].length) * 100).toFixed()}%` : '0%'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                {Object.values(unattemptedQuestions).flat().length > 0 ? (
                  <>
                    <p className="text-center">You still have {Object.values(unattemptedQuestions).flat().length} unattempted questions.</p>
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Subject</th>
                          <th className="px-4 py-2">Unattempted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(unattemptedQuestions).map((subject) => (
                          <tr key={subject}>
                            <td className="border px-4 py-2 font-semibold">{subject}</td>
                            <td className="border px-4 py-2 text-center">{unattemptedQuestions[subject]?.length || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p className="text-center">Ensure you have reviewed your answers before submission.</p>
                )}
              </>
            )}
          </SubmitButton>
        </div>
      </div>
      {currentQuestionData && (
        <div className="flex p-4 space-x-3">
          <div key={currentQuestion} className="border-2 border-gray-300 rounded w-full">
            <div className="p-4 flex flex-col space-y-2">
              <span className="font-semibold uppercase text-accent-2">{selectedSubject}</span>
              <span className="font-semibold">Question {questionNumber}</span>
            </div>
            <div className="w-full p-4 border-y-2">
              <div className="space-y-5 p-4">
                {image && <Image src={image} alt="Question Image" className="question-image" width={100} height={100} priority />}
                {section && (
                  <div className="scroll-content bg-white rounded-sm max-h-64 overflow-y-auto">
                    <p className="capitalize">{parse(section || '')}</p>
                  </div>
                )}
                <p>{parse(question || '')}</p>
                <ol type="A">
                  {option &&
                    Object.entries(option as { [key: string]: string })
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <li key={key}>
                          <label>
                            <input type="radio" name={`question_${currentQuestionId}`} value={key} checked={selectedOption === key} onChange={() => handleAnswerSelection(currentQuestionId, key)} /> <span className="uppercase">{key}</span>. {parse(value || '')}
                          </label>
                        </li>
                      ))}
                </ol>
                {submitted && (
                  <>
                    <p>{feedbackMessage}</p>
                    <p>{solution}</p>
                  </>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex my-5 space-x-3">
                <button aria-label="Previous Question Button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="bg-accent-2 text-white py-1 px-3 rounded-sm w-28">
                  Previous
                </button>
                <button aria-label="Next Question Button" onClick={handleNextQuestion} disabled={currentQuestion >= currentQuestionsData.length - 1} className="bg-accent-2 text-white py-1 px-3 rounded-sm w-28">
                  Next
                </button>
              </div>
              <div className="flex flex-wrap text-white my-5 gap-1">
                {currentQuestionsData.map((question, index) => (
                  <span
                    key={question.id}
                    className={`p-1 rounded-sm w-10 text-center
                      ${currentQuestion === index && selectedAnswers[question.id] === undefined ? 'text-accent-2 border-2 border-accent-2' : ''}
                      ${currentQuestion === index && selectedAnswers[question.id] !== undefined ? 'text-accent-3 border-2 border-accent-3' : ''}
                      ${currentQuestion !== index && selectedAnswers[question.id] === undefined ? 'bg-accent-2' : ''}
                      ${currentQuestion !== index && selectedAnswers[question.id] !== undefined ? 'bg-accent-3' : ''}
                    `}
                    onClick={() => handlePaginationClick(index)}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Candidate subject={selectedSubject!} />
        </div>
      )}
    </div>
  );
}
