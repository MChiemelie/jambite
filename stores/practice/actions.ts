import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { postPerformanceData, postPracticeData } from '@/services/practice';
import { RootState } from '@/stores';
import { PracticeData, Question } from '@/types';
import { setError, setResultsFeedback, setScore, setSubjectScores, setSubmitted } from './slice';

const generateFeedbackMessage = (userAnswer: string, correctAnswer: string) => ({
  type: userAnswer === correctAnswer ? 'correct' : userAnswer ? 'incorrect' : 'unattempted',
  userAnswer: userAnswer.toUpperCase(),
  correctAnswer: correctAnswer.toUpperCase(),
});

const calculateScoresForAllSubjects = (subjects: string[], questions: Record<string, Question[]>, selectedAnswers: Record<number, string>, feedbackMessages: Record<number, {}>) => {
  const subjectScores: Record<string, number> = {};
  let totalScore = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  const subjectsData = subjects.map((subject) => {
    const subjectQuestions = questions[subject];
    totalQuestions += subjectQuestions.length;

    const attempts = subjectQuestions.filter((q) => selectedAnswers[q.id]).length;

    const subjectScore = subjectQuestions.reduce((score, question) => {
      const userAnswer = selectedAnswers[question.id]?.toLowerCase() || '';
      const correctAnswer = question.answer.toLowerCase();

      feedbackMessages[question.id] = generateFeedbackMessage(userAnswer, correctAnswer);
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) {
        totalCorrect += 1;
      }
      return score + (isCorrect ? 1 : 0);
    }, 0);

    totalScore += subjectScore;
    subjectScores[subject] = subjectScore;

    return {
      subject,
      totalQuestions: subjectQuestions.length,
      attempts,
      correct: subjectScore,
      score: Math.round((subjectScore / subjectQuestions.length) * 100),
    };
  });

  return { subjectsData, subjectScores, totalScore, totalCorrect, totalQuestions };
};

export const submitPractice = createAsyncThunk<void, void, { state: RootState }>('practice/submitPractice', async (_, { getState, dispatch }) => {
  const { selectedAnswers, questions, selectedSubjects, countdown, user, totalNumberAttempted } = getState().practice;

  if (!user || !user.$id) {
    console.error('User information is missing!');
    dispatch(setError('User not logged in.'));
    return;
  }
  const feedbackMessages: Record<number, { type: string; userAnswer?: string; correctAnswer: string }> = {};
  const { subjectsData, subjectScores, totalScore, totalCorrect, totalQuestions } = calculateScoresForAllSubjects([...selectedSubjects, 'Use of English'], questions, selectedAnswers, feedbackMessages);

  const practiceData: PracticeData = {
    practiceId: uuidv4(),
    timestamp: new Date().toISOString(),
    duration: 1200 - countdown,
    feedback: 'It was good',
    userId: user.$id,
    subjects: JSON.stringify(subjectsData),
    completed: true,
    totalScore,
    totalCorrect,
    totalQuestions,
    totalAttempts: totalNumberAttempted,
  };

  try {
    await postPracticeData(practiceData);

    const subjectPerformancePromises = subjectsData.map((subjectData) =>
      postPerformanceData({
        ...subjectData,
        userId: user.$id,
        practiceId: practiceData.practiceId,
        performanceId: uuidv4(),
      })
    );

    await Promise.all(subjectPerformancePromises);

    dispatch(setSubmitted(true));
    dispatch(setScore(totalScore));
    dispatch(setSubjectScores(subjectScores));
    dispatch(setResultsFeedback(feedbackMessages));
  } catch (error) {
    console.error('Failed to submit practice:', error);
    dispatch(setError('Submission failed! Please try again.'));
  }
});

export const updateUnattemptedQuestions = createAction<{
  subject: string;
  questionId: number;
}>('practice/updateUnattemptedQuestions');
