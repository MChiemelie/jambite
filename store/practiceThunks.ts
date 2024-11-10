import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { setScore, setResultsFeedback, setSubmitted, setSubjectScores } from './practiceSlice';
import { Question } from '@/types/practice';
import AppThunk from '@/store';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/services/supabase/client';

type AppThunk = ThunkAction<void, RootState, unknown, Action>;

const checkAnswer = (questionId: number, selectedAnswers: { [key: number]: string }, questions: Question[]) => {
  const question = questions.find((q) => q.id === questionId);
  if (!question) return false;

  const correctAnswer = question.answer.toLowerCase();
  return correctAnswer === (selectedAnswers[questionId] || '').toLowerCase();
};

export const calculateAndSetScores = (): AppThunk => (dispatch, getState) => {
  const { practice } = getState();
  const { selectedAnswers, questions, selectedSubjects } = practice;
  let totalScore = 0;
  const subjectScores: { [subject: string]: number } = {};

  selectedSubjects.forEach((subject) => {
    const subjectQuestions = questions[subject];
    let subjectScore = 0;

    subjectQuestions.forEach((question) => {
      const { id, answer } = question;
      if (selectedAnswers[id] && selectedAnswers[id].toLowerCase() === answer.toLowerCase()) {
        subjectScore += 1;
        totalScore += 1;
      }
    });

    subjectScores[subject] = subjectScore;
  });

  dispatch(setScore(totalScore));
  dispatch(setSubjectScores(subjectScores));
};

export const submitPractice = createAsyncThunk<void, void, { state: RootState }>('practice/submitPractice', async (_, { getState, dispatch }) => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { selectedAnswers, questions, selectedSubjects, countdown } = getState().practice;

  console.log(user);

  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  const results: { id: number; isCorrect: boolean }[] = [];
  const feedbackMessages: { [key: number]: string } = {};
  let totalScore = 0;
  const subjectScores: { [subject: string]: number } = {};

  const calculateSubjectScore = (subjectQuestions) => {
    let subjectScore = 0;
    let attempts = 0;

    subjectQuestions.forEach((question) => {
      const isCorrect = checkAnswer(question.id, selectedAnswers, subjectQuestions);
      results.push({ id: question.id, isCorrect });

      const userAnswer = selectedAnswers[question.id]?.toUpperCase();
      const correctAnswer = question.answer.toUpperCase();
      feedbackMessages[question.id] = userAnswer === undefined ? `You didn't attempt this question. ❌😐 The correct answer is ${correctAnswer}. ✔️🤗` : isCorrect ? `You are Correct! ✔️🤗 ${correctAnswer} is the answer.` : `${userAnswer} is not correct. ❌😐 The correct answer is ${correctAnswer}. ✔️🤗`;

      if (isCorrect) subjectScore += 1;
      if (selectedAnswers[question.id]) attempts += 1;
    });

    return { subjectScore, attempts };
  };

  const attemptedSubjects = ['Use of English', ...selectedSubjects];
  const subjectsData = attemptedSubjects.map((subject) => {
    const subjectQuestions = questions[subject];
    const { subjectScore, attempts } = calculateSubjectScore(subjectQuestions);

    totalScore += subjectScore;
    subjectScores[subject] = subjectScore;

    return {
      name: subject,
      totalQuestions: subjectQuestions.length,
      attempts,
      score: (subjectScore / subjectQuestions.length) * 100
    };
  });

  const quizId = uuidv4();
  const practiceData = {
    id: quizId,
    user_id: user.id,
    timestamp: new Date().toISOString(),
    duration: 1200 - countdown,
    feedback: 'It was good',
    subjects: subjectsData,
    status: 'completed'
  };

  // Insert the quiz data into the database
  const { data, error } = await supabase.from('quizzed').insert([practiceData]);

  if (error) {
    console.error('Error inserting practice data:', error);
  } else {
    console.log('Practice data inserted successfully:', data);
  }

  // Dispatch state updates
  dispatch(setSubmitted(true));
  dispatch(setScore(totalScore));
  dispatch(setSubjectScores(subjectScores));
  dispatch(setResultsFeedback(feedbackMessages));
});

// Action to update unattempted questions
export const updateUnattemptedQuestions = createAction<{ subject: string; questionId: number }>('practice/updateUnattemptedQuestions');
