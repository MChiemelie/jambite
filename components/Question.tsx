'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from '@/styles';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeButton } from '@/components';
import { Session } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/utilities/supabase';
import { v4 as uuidv4 } from 'uuid';

type Question = {
  id: number;
  question: string;
  option: { [key: string]: string };
  answer: string;
};

type QuestionsProps = {
  subject: string;
  data: Question[];
};

export default function Question({ session, questionsData }: { session: Session | null, questionsData: QuestionsProps }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const [score, setScore] = useState(0);
  const [resultsFeedback, setResultsFeedback] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const user = session?.user;

  const handleAnswerSelection = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: selectedOption.toLowerCase() }));
  };

  const checkAnswer = useCallback((questionId) => {
    return () => {
      const selectedOption = selectedAnswers[questionId];
      if (selectedOption === undefined) {
        return false;
      }
      const correctAnswer = questionsData.data.find((question) => question.id === questionId).answer.toLowerCase();
      return correctAnswer === selectedOption.toLowerCase();
    };
  }, [selectedAnswers, questionsData.data]);


  const handleNextQuestion = () => {
    if (currentQuestion < questionsData.data.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (quizSubmitted) {
      return;
    }

    const userConfirmed = window.confirm("Are you sure you want to submit?");
    if (!userConfirmed) {
      return;
    }

    try {
      const newResults = questionsData.data.map((question) => {
        const isCorrect = checkAnswer(question.id)();
        return { id: question.id, isCorrect };
      });

      setSubmitted(true);
      setQuizSubmitted(true);

      const userScore = newResults.filter((result) => result.isCorrect).length;
      setScore(userScore);

      const feedbackMessages = {};
      questionsData.data.forEach((question) => {
        const isCorrect = newResults.find((result) => result.id === question.id).isCorrect;
        if (selectedAnswers[question.id] === undefined) {
          feedbackMessages[question.id] = `You didn't attempt this question. ❌😐 The correct answer is ${question.answer.toUpperCase()}. ✔️🤗`;
        } else if (isCorrect) {
          feedbackMessages[question.id] = `You are Correct! ✔️🤗 ${question.answer.toUpperCase()} is the answer`;
        } else {
          feedbackMessages[question.id] = `${selectedAnswers[question.id].toUpperCase()} is not correct. ❌😐 The correct answer is ${question.answer.toUpperCase()}. ✔️🤗`;
        }
      });
      setResultsFeedback(feedbackMessages);

      const quizId = uuidv4();
      const currentUserId = user?.id as string;
      const timestamp = new Date().toISOString();

      const subject = questionsData.subject;
      const time_taken = 900 - countdown;

      const { data, error } = await supabase
        .from('quizzes')
        .insert([
          {
            id: quizId,
            user_id: currentUserId,
            subject,
            score: userScore,
            time_taken,
            timestamp,
          },
        ]);

      if (countdown <= 0) {
        alert("Time is up! Your quiz has been submitted.");
      } else {
        console.log('User performance recorded successfully:', data);
      }

      if (error) {
        console.error('Error recording user performance. Supabase API returned an error:', error);
        throw new Error('Error recording user performance.');
      }

      console.log('User performance recorded successfully:', data);
    } catch (error) {
      console.error('Error recording user performance:', error.message);
    }
  }, [countdown, quizSubmitted, selectedAnswers, user, checkAnswer, questionsData.data, questionsData.subject]);

  useEffect(() => {
    let timer;
    if (!submitted) {
      timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown((prevCountdown) => prevCountdown - 1);
        } else {
          handleSubmit();
        }
      }, 1000);
    }
    if (submitted) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [countdown, handleSubmit, submitted]);

  const currentQuestionData = questionsData?.data[currentQuestion];
  const selectedOption = selectedAnswers[currentQuestionData.id];
  const feedbackMessage = resultsFeedback[currentQuestionData.id];

  return (
    <div className='py-2'>
      <nav className='flex justify-between m-2 border-b-2 pb-2 border-accent-3 space-x-1'>
        <Image src='/logo.png' alt='logo' width={100} height={100} className='rounded w-12 md:w-16' />
        <div className="flex items-center justify-evenly px-4">
          <ThemeButton />
          <Link href='/dashboard' className="flex mx-auto w-fit justify-evenly items-center text-sm">
            Dashboard
            <Image className='w-1/4 rounded-full border-2 border-accent-1' src={`${user.user_metadata.avatar_url}`} width={100} height={100} alt='your picture' />
          </Link>
          <form action="/auth/signout" method="post" className="flex justify-center items-center w-fit">
            <button className={styles.signout} type="submit">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <div className="flex justify-around p-4">
        <span className='font-semibold text-lg text-center sm:text-xl capitalize'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-5 fill-current mx-auto' viewBox="0 0 512 512">
            <path d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 00-17.92 5.33A32 32 0 0016 79.9V366c0 19.34 13.76 33.93 32 33.93 71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 006.94-3V106.82a15.89 15.89 0 00-5.46-12A143 143 0 00202.24 74zM481.92 53.3A31.33 31.33 0 00464 48c-67.61.3-118.11 8.71-154.24 26a143.31 143.31 0 00-32.31 20.78 15.93 15.93 0 00-5.45 12v337.13a3.93 3.93 0 006.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0032-32v-288a32 32 0 00-14.12-26.61z" />
          </svg>
          {questionsData.subject}
        </span>
        <span className='font-semibold text-lg text-center sm:text-xl'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-5 fill-current mx-auto' viewBox="0 0 512 512">
            <path d="M256 48C141.12 48 48 141.12 48 256s93.12 208 208 208 208-93.12 208-208S370.88 48 256 48zm-82.33 114.34l105 71a32.5 32.5 0 01-37.25 53.26 33.21 33.21 0 01-8-8l-71-105a8.13 8.13 0 0111.32-11.32zM256 432c-97 0-176-78.95-176-176a174.55 174.55 0 0153.87-126.72 14.15 14.15 0 1119.64 20.37A146.53 146.53 0 00108.3 256c0 81.44 66.26 147.7 147.7 147.7S403.7 337.44 403.7 256c0-76.67-58.72-139.88-133.55-147v55a14.15 14.15 0 11-28.3 0V94.15A14.15 14.15 0 01256 80c97.05 0 176 79 176 176s-78.95 176-176 176z" />
          </svg>
          {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}
        </span>
      </div>
      <div key={currentQuestionData.id} className="border lg:border-2 p-4 border-accent-3 w-10/12 mx-auto rounded-lg">
        <p className='text-md sm:text-lg lg:text-xl'>{currentQuestion + 1}. {currentQuestionData.question}</p>
        <ol type="A" className='m-2 p-4 text-justify'>
          {Object.entries(currentQuestionData.option).map(([key, value], index) => {
            if (index >= 4 || value === null) { return null; }
            return (
              <li key={key}>
                <label className='py-2 text-md sm:text-lg lg:text-xl captailize'>
                  <input type="radio" className='w-10' name={`question_${currentQuestionData.id}`} value={key} checked={selectedOption === key} onChange={() => handleAnswerSelection(currentQuestionData.id, key)} />
                  <span className='uppercase h-full'>{key}</span>. {value}
                </label>
              </li>
            );
          })}
        </ol>
        {submitted && <p className='text-md lg:text-xl text-center'> {feedbackMessage} </p>}
      </div>
      {submitted && <p className='text-center text-md lg:text-xl my-4'>You scored {score} out of {questionsData.data.length}! </p>}
      <div className='flex justify-between w-3/5 mx-auto my-5 text-md lg:text-xl'>
        <button aria-label="Previous Question Button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className={`${styles.button} bg-accent-1`}>Previous</button>
        <button aria-label="Submit Button" onClick={handleSubmit} disabled={quizSubmitted} className={`${styles.button} ${quizSubmitted ? 'bg-gray-400' : 'bg-accent-4'}`}>
          {quizSubmitted ? 'Submitted' : 'Submit'}
        </button>
        <button aria-label="Next Question Button" onClick={handleNextQuestion} disabled={currentQuestion === questionsData.data.length - 1} className={`${styles.button} bg-accent-3`}>Next</button>
      </div>
      <div className="flex flex-wrap justify-center w-4/5 mx-auto my-5 gap-1">
        {questionsData.data.map((question, index) => (
          <span key={question.id}
            className={`p-1 rounded-full text-sm text-center ${selectedAnswers[question.id] !== undefined ? 'bg-accent-1' : 'bg-accent-2'}`}
            onClick={() => setCurrentQuestion(index)}
          >{index + 1}</span>
        ))}
      </div>
    </div>
  );
};