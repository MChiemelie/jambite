import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Practice, Question } from '@/types/practice';
import { updateUnattemptedQuestions } from './practiceThunks';

const initialState: Practice = {
  unattemptedQuestions: {},
  currentQuestion: 0,
  selectedAnswers: {},
  totalNumberAttempted: 0,
  numberAttempted: {},
  attemptedQuestions: {},
  submitted: false,
  countdown: 1200,
  score: 0,
  resultsFeedback: {},
  timeEnd: false,
  submitPopup: false,
  selectedSubjects: [],
  selectedSubjectsParameters: [],
  questions: {},
  subjectScores: {},
  loading: false,
  error: null,
  user: null
};

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setSelectedSubjects: (state, action: PayloadAction<string[]>) => {
      state.selectedSubjects = action.payload;
    },
    setScore(state, action: PayloadAction<number>) {
      state.score = action.payload;
    },
    setSubjectScores(state, action: PayloadAction<{ [subject: string]: number }>) {
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
    setCountdown(state, action: PayloadAction<number>) {
      state.countdown = action.payload;
    },
    setResultsFeedback: (state, action: PayloadAction<{ [key: number]: string }>) => {
      state.resultsFeedback = action.payload;
    },
    setSubmitPopup: (state, action: PayloadAction<boolean>) => {
      state.submitPopup = action.payload;
    },
    selectAnswer: (state, action: PayloadAction<{ questionId: number; selectedOption: string; subject: string }>) => {
      const { questionId, selectedOption, subject } = action.payload;
      state.selectedAnswers[questionId] = selectedOption.toLowerCase();

      if (!state.attemptedQuestions[questionId]) {
        state.attemptedQuestions[questionId] = true;
        state.totalNumberAttempted += 1;

        if (!state.numberAttempted[subject]) {
          state.numberAttempted[subject] = 0;
        }
        state.numberAttempted[subject] += 1;

        // Dispatch the update to unattempted questions
        state.unattemptedQuestions[subject] = state.unattemptedQuestions[subject]?.filter((id) => id !== questionId);
      }
    },

    setQuestions(state, action: PayloadAction<{ [subject: string]: Question[] }>) {
      state.questions = {
        ...state.questions,
        ...action.payload
      };

      // Initialize unattempted questions for new subjects
      Object.keys(action.payload).forEach((subject) => {
        if (!state.unattemptedQuestions[subject]) {
          state.unattemptedQuestions[subject] = action.payload[subject].map((q) => q.id);
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateUnattemptedQuestions, (state, action: PayloadAction<{ subject: string; questionId: number }>) => {
      const { subject, questionId } = action.payload;
      // Remove the question from unattemptedQuestions if it exists
      if (state.unattemptedQuestions[subject]) {
        state.unattemptedQuestions[subject] = state.unattemptedQuestions[subject].filter((id) => id !== questionId);
      }
    });
  }
});

export const { selectAnswer, setCurrentQuestion, setSubjectScores, setSelectedSubjects, setSelectedSubjectsParameters, updateCountdown, setSubmitted, setResultsFeedback, setScore, previousQuestion, nextQuestion, timeEnded, setSubmitPopup, setQuestions, setCountdown, setUser } = practiceSlice.actions;

export default practiceSlice.reducer;
