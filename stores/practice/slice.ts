import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Practice, Question, User } from '@/types';
import { submitPractice, updateUnattemptedQuestions } from './actions';

const getInitialState = (): Practice => ({
  unattemptedQuestions: {},
  currentQuestion: 0,
  selectedAnswers: {},
  aiReviews: {},
  generatingForQuestionId: null,
  totalNumberAttempted: 0,
  numberAttempted: {},
  attemptedQuestions: {},
  submitted: false,
  countdown: 1200,
  score: 0,
  resultsFeedback: {} as Record<number, { type: string; userAnswer?: string; correctAnswer: string }>,
  timeEnd: false,
  submitPopup: false,
  selectedSubjects: [],
  selectedSubjectsParameters: [],
  questions: {},
  subjectScores: {},
  loading: false,
  error: null,
  user: null,
});

const initialState = getInitialState();

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setSelectedSubjects: (state, action: PayloadAction<string[]>) => {
      state.selectedSubjects = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setSubjectScores: (state, action: PayloadAction<{ [subject: string]: number }>) => {
      state.subjectScores = action.payload;
    },
    setSelectedSubjectsParameters: (state, action: PayloadAction<string[]>) => {
      state.selectedSubjectsParameters = action.payload;
    },
    nextQuestion: (state) => {
      state.currentQuestion += 1;
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      }
    },
    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.submitted = action.payload;
    },
    timeEnded: (state) => {
      state.timeEnd = true;
      state.submitted = true;
      state.submitPopup = true;
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestion = action.payload;
    },
    updateCountdown: (state) => {
      if (state.countdown > 0) {
        state.countdown -= 1;
      } else {
        state.timeEnd = true;
        state.submitted = true;
        state.submitPopup = true;
      }
    },
    setCountdown: (state, action: PayloadAction<number>) => {
      state.countdown = action.payload;
    },
    setResultsFeedback: (state, action: PayloadAction<Record<number, { type: string; userAnswer?: string; correctAnswer: string }>>) => {
      state.resultsFeedback = action.payload;
    },
    setSubmitPopup: (state, action: PayloadAction<boolean>) => {
      state.submitPopup = action.payload;
    },
    selectAnswer: (state, action: PayloadAction<{ questionId: number; selectedOption: string; subject: string }>) => {
      const { questionId, selectedOption, subject } = action.payload;

      if (!state.questions[subject]?.some((q) => q.id === questionId)) {
        console.error(`Question ID ${questionId} does not belong to subject ${subject}`);
        return;
      }

      state.selectedAnswers[questionId] = selectedOption.toLowerCase();

      if (!state.attemptedQuestions[questionId]) {
        state.attemptedQuestions[questionId] = true;
        state.totalNumberAttempted += 1;

        if (!state.numberAttempted[subject]) {
          state.numberAttempted[subject] = 0;
        }
        state.numberAttempted[subject] += 1;
      }
    },
    setAiReview: (state, action) => {
      const { subject, questionId, review } = action.payload;
      if (!state.aiReviews[subject]) {
        state.aiReviews[subject] = {};
      }
      state.aiReviews[subject][questionId] = review; // Ensures only this question's review is set
    },
    setQuestions: (state, action: PayloadAction<{ [subject: string]: Question[] }>) => {
      const newQuestions = { ...state.questions, ...action.payload };
      const allQuestionIds = Object.values(newQuestions)
        .flat()
        .map((q) => q.id);

      if (new Set(allQuestionIds).size !== allQuestionIds.length) {
        console.error('Duplicate Question IDs detected in setQuestions');
      }

      state.questions = newQuestions;

      Object.keys(action.payload).forEach((subject) => {
        if (!state.unattemptedQuestions[subject]) {
          state.unattemptedQuestions[subject] = action.payload[subject].map((q) => q.id);
        }
      });
    },
    reset: () => getInitialState(),
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUnattemptedQuestions, (state, action) => {
        const { subject, questionId } = action.payload;
        if (state.unattemptedQuestions[subject]) {
          state.unattemptedQuestions[subject] = state.unattemptedQuestions[subject].filter((id) => id !== questionId);
        }
      })
      .addCase(submitPractice.rejected, (state, action) => {
        state.error = action.error.message || 'An error occurred while submitting the practice.';
      });
  },
});

export const { selectAnswer, setCurrentQuestion, setSubjectScores, setSelectedSubjects, setSelectedSubjectsParameters, updateCountdown, setSubmitted, setAiReview, setResultsFeedback, setScore, previousQuestion, nextQuestion, timeEnded, setSubmitPopup, setQuestions, setCountdown, setUser, reset, setError, clearError } = practiceSlice.actions; //startGeneratingAiReview, clearGeneratingAiReview,

export default practiceSlice.reducer;
