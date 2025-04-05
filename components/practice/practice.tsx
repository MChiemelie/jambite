'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import { Bot, Check, ThumbsUp, X } from 'lucide-react';
import { useAIChatStream } from 'next-ai-stream/client';
import Image from 'next/image';
import Link from 'next/link';
import { ExamTimer, ReportQuestionDialog, Results, SubmitButton, UnattemptedSummary } from '@/components/practice';
import { subjectPathMap } from '@/data/subjects';
import { AppDispatch, RootState } from '@/stores';
import { submitPractice, updateUnattemptedQuestions } from '@/stores/practice/actions';
import { nextQuestion, previousQuestion, selectAnswer, setAiReview, setCurrentQuestion, timeEnded } from '@/stores/practice/slice';
import { Question, Questions } from '@/types';
import { CalculatorDialog, Candidate } from '.';
import { LoadingDots } from '../custom';

export default function Practice({ questions }: Questions) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestion, selectedAnswers, submitted, countdown, score, numberAttempted, totalNumberAttempted, resultsFeedback, timeEnd, unattemptedQuestions, subjectScores, aiReviews, user } = useSelector((state: RootState) => state.practice);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Use of English');
  const [pendingReview, setPendingReview] = useState<{ subject: string; questionId: number } | null>(null);
  const examStartTimeRef = useRef<number>(Date.now());
  const [finalElapsed, setFinalElapsed] = useState<number>(0);
  const { messages, submitNewMessage, loading } = useAIChatStream({
    apiEndpoint: '/api/ai',
    systemPrompt: 'You are a world class teacher helping Nigerian senior and post-secondary students to review JAMB, SSCE, and NECO exam past questions. Explain why their answer is right or wrong in two sentences, under 200 characters. Be friendly, simple, informative, expository, analytical and direct. No emojis.',
  });

  useEffect(() => {
    if (timeEnd) {
      setIsPopupOpen(true);
      const elapsed = Math.floor((Date.now() - examStartTimeRef.current) / 1000);
      setFinalElapsed(elapsed);
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

  const { id: currentQuestionId, question, option, image, solution, section, answer } = currentQuestionData as Question;
  const selectedOption = selectedAnswers[currentQuestionId ?? -1] || null;
  const currentAiReview = aiReviews[selectedSubject]?.[currentQuestionId] || '';

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
      dispatch(updateUnattemptedQuestions({ subject: selectedSubject, questionId }));
    },
    [dispatch, selectedSubject]
  );

  const handlePracticeSubmit = useCallback(async () => {
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

  const renderFeedbackMessage = (feedback: { type: string; userAnswer?: string; correctAnswer: string }) => {
    switch (feedback.type) {
      case 'correct':
        return (
          <p className="text-md md:text-lg">
            You are Correct! <ThumbsUp className="inline w-4 h-4 fill-current" /> <br className="md:hidden" /> The answer is {feedback.correctAnswer}
            <Check className="inline w-4 h-4 md:w-6 md:h-6 text-green-600" />.
          </p>
        );
      case 'incorrect':
        return (
          <p className="text-md md:text-lg">
            <X className="inline w-4 h-4 md:w-6 md:h-6 text-red-600" /> {feedback.userAnswer} is incorrect. The correct answer is {feedback.correctAnswer} <br className="md:hidden" /> <Check className="inline w-4 h-4 md:w-6 md:h-6 text-green-600" />.
          </p>
        );
      case 'unattempted':
        return (
          <p className="text-md md:text-lg">
            You didn't attempt this question <X className="inline w-4 h-4 md:w-6 md:h-6 text-red-600" />. The correct answer is {feedback.correctAnswer} <br className="md:hidden" /> <Check className="inline w-4 h-4 md:w-6 md:h-6 text-green-600" />.
          </p>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!loading && messages.length > 0 && pendingReview) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const reviewString = typeof lastMessage.content === 'string' ? lastMessage.content : '';
        dispatch(
          setAiReview({
            subject: pendingReview.subject,
            questionId: pendingReview.questionId,
            review: reviewString,
          })
        );
        setPendingReview(null);
      }
    }
  }, [messages, loading, dispatch, pendingReview]);

  const handleGenerateReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || currentAiReview) return;
    setPendingReview({ subject: selectedSubject, questionId: currentQuestionId });
    const reviewText = `Question: ${question}, Selected Answer: ${selectedOption}, if this is null, the user didn't select an option, Correct Answer: ${answer} Options: ${Object.entries(option)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')} ${image ? `Image: ${image}` : ''} Context: ${section}.`;
    submitNewMessage(reviewText);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="p-3 flex flex-col md:flex-row gap-4 items-center md:justify-between text-sm">
        <div className="flex items-center gap-3 uppercase w-full">
          {questions && selectedSubject && (
            <div className="flex gap-2 items-center w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full place-items-center lg:max-w-[950px]">
                {Object.keys(questions).map((subject) => (
                  <span key={subject} onClick={() => handleSubjectChange(subject)} className={`w-full p-2 rounded cursor-pointer text-center ${selectedSubject === subject ? 'text-accent-2 border-2 border-accent-2' : 'bg-accent-2 text-white'}`}>
                    {subjectPathMap[subject] || subject}
                  </span>
                ))}
              </div>
              <span className="hidden md:block p-2 bg-accent-2 rounded text-white">
                <CalculatorDialog />
              </span>
            </div>
          )}
        </div>
        <div className="sm:flex gap-3 items-center justify-normal w-full md:w-fit">
          {submitted && (
            <div className="flex gap-3 justify-evenly w-full">
              <Link href="/dashboard" className="lg:w-40 text-sm text-center border-2 border-gray-300 rounded p-2">
                View Dashboard
              </Link>
              <Link href="/analytics" className="lg:w-40 text-sm text-center border-2 border-gray-300 rounded p-2">
                View Analytics
              </Link>
            </div>
          )}
          <div className="flex justify-evenly lg:justify-between gap-2 w-full md:w-fit">
            <span className="block md:hidden p-2 bg-accent-2 rounded text-white">
              <CalculatorDialog />
            </span>
            <ExamTimer onTimeEnd={handleTimeEnd} submitted={submitted} />
            <SubmitButton isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} buttonText={submitted || timeEnd ? 'Submitted' : 'End Exam'} disabled={submitted || timeEnd} title={popupTitle} description={popupDescript} isSubmitted={submitted} onSubmit={handlePracticeSubmit} className={`p-2 rounded text-white ${submitted || timeEnd ? 'bg-gray-400 text-black' : 'bg-accent-3'}`}>
              {submitted || timeEnd ? <Results score={score} totalQuestions={totalQuestions} totalNumberAttempted={totalNumberAttempted} elapsedTime={finalElapsed} subjectScores={subjectScores} questions={questions as { [subject: string]: Question[] }} numberAttempted={numberAttempted} /> : <UnattemptedSummary unattemptedQuestions={unattemptedQuestions as Record<string, number[]>} />}
            </SubmitButton>
          </div>
        </div>
      </div>
      {currentQuestionData && (
        <div className="md:flex p-4 gap-4">
          <div key={currentQuestion} className="border-2 border-gray-300 rounded w-full">
            <div className="p-4 flex flex-col lg:flex-row items-center justify-between w-full gap-2">
              <div className="flex flex-col gap-2">
                <span className="uppercase text-accent-2 text-center lg:text-justify">{selectedSubject}</span>
                <span className="text-center lg:text-justify">Question {questionNumber}</span>
              </div>
              {submitted && <ReportQuestionDialog subject={selectedSubject.toLowerCase()} questionId={currentQuestionId} fullName={user?.name} onReportSubmitted={() => {}} />}
            </div>
            <div className="w-full p-1 lg:p-4 border-y-2 border-gray-300 text-sm md:text-lg">
              <div className="flex flex-col gap-5 p-4">
                {image && <Image src={image} alt="Illustration related to the question" className="w-full max-w-md h-auto object-contain mx-auto md:mx-0" priority sizes="(max-width: 768px) 100vw, 50vw" width={500} height={500} />}
                {section && (
                  <div className="scroll-content rounded max-h-64 overflow-y-auto">
                    <p className="capitalize">{parse(section || '')}</p>
                  </div>
                )}
                <p className="text-sm md:text-lg">{parse(question || '')}</p>
                <ol type="A">
                  {option &&
                    Object.entries(option as { [key: string]: string })
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <li key={key}>
                          <label className="flex md:items-center gap-2 md:gap-4">
                            <input className="appearance-none w-4 h-4 border-2 md:border-4 border-gray-300 rounded-full checked:bg-blue-200 checked:border-blue-600" type="radio" name={`question_${currentQuestionId}`} value={key} checked={selectedOption === key} onChange={() => handleAnswerSelection(currentQuestionId, key)} />
                            <span className="uppercase">{key}.</span>
                            <span>{parse(value || '')}</span>
                          </label>
                        </li>
                      ))}
                </ol>
                {submitted && (
                  <div>
                    <div>{currentQuestionId !== undefined && resultsFeedback[currentQuestionId] ? renderFeedbackMessage(resultsFeedback[currentQuestionId]) : null}</div>
                    <p className="capitalize">{parse(solution || '')}</p>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center gap-2 p-4 glow-animation">
                    <Bot className="h-12 w-12" />
                    <p>Erudite is thinking</p>
                    <LoadingDots />
                  </div>
                )}
                {currentAiReview && (
                  <div className="mt-4 flex items-center p-4 bg-gray-50 rounded  gap-2">
                    <Bot className="h-12 w-12" />
                    <p className="text-sm md:text-lg">{currentAiReview}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 my-5 gap-3 text-sm md:flex md:gap-3 md:text-lg w-fit md:w-full mx-auto">
                <button aria-label="Previous Question Button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="bg-accent-2 text-white py-1 px-3 rounded-sm w-28">
                  Previous
                </button>
                <button aria-label="Next Question Button" onClick={handleNextQuestion} disabled={currentQuestion >= currentQuestionsData.length - 1} className="bg-accent-2 text-white py-1 px-3 rounded-sm w-28">
                  Next
                </button>
                {submitted && user.ai && (
                  <div className="col-span-2 lg:col-span-1 w-full lg:w-fit">
                    <form onSubmit={handleGenerateReview}>
                      <button type="submit" disabled={!!currentAiReview || loading} className="bg-accent-4 text-white py-1 px-3 rounded-sm w-full lg:w-fit">
                        {currentAiReview ? 'AI Review Generated' : 'Generate AI Review'}
                      </button>
                    </form>
                  </div>
                )}
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
          <Candidate subject={selectedSubject} />
        </div>
      )}
    </div>
  );
}
