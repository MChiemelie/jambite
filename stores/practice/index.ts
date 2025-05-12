'use client';

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { PracticeActions, PracticeStore } from '@/types';
import { selectAnswer, setAIReview, setQuestions, submitPractice, setUnattemptedQuestions } from '@/helpers/practice';

const initialState: PracticeStore = {
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
  resultsFeedback: {},
  timeEnd: false,
  submitPopup: false,
  selectedSubjects: [],
  selectedSubjectsParameters: [],
  questions: {},
  subjectScores: {},
  loading: false,
  error: null,
  user: null,
  pendingReview: null,
  selectedSubject: 'Use of English',
  hasHydrated: false,
  fetchData: true,
};

export const usePracticeStore = create<PracticeStore & { actions: PracticeActions }>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        actions: {
          setHydrated: (v) => set({ hasHydrated: v }),
          setFetchData: (v) => set({ fetchData: v }),
          setUser: (user) => set({ user }),
          setSelectedSubjects: (selectedSubjects) => set({ selectedSubjects }),
          setSelectedSubjectsParameters: (selectedSubjectsParameters) => set({ selectedSubjectsParameters }),
          setScore: (score) => set({ score }),
          setSubjectScores: (subjectScores) => set({ subjectScores }),
          nextQuestion: () => set((s) => ({ currentQuestion: s.currentQuestion + 1 })),
          previousQuestion: () => set((s) => ({ currentQuestion: Math.max(0, s.currentQuestion - 1) })),
          setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
          setSubmitted: (submitted) => set({ submitted }),
          timeEnded: () => {
            set({ timeEnd: true });
            get().actions.submitPractice();
          },
          setCountdown: (countdown) => set({ countdown }),
          setResultsFeedback: (resultsFeedback) => set({ resultsFeedback }),
          setSubmitPopup: (v) => set({ submitPopup: v }),
          selectAnswer: ({ questionId, selectedOption, subject }) => set((s) => selectAnswer(s, questionId, selectedOption, subject) || {}),
          setQuestions: (payload) => set((s) => setQuestions(s, payload)),
          submitPractice: () => submitPractice(get, set),
          setAiReview: ({ subject, questionId, review }) => set((s) => setAIReview(s, subject, questionId, review)),
          setUnattemptedQuestions: (subject, questionId) => set((s) => setUnattemptedQuestions(s, subject, questionId)),
          setPendingReview: (pendingReview) => set({ pendingReview }),
          setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
          reset: () => set({ ...initialState }),
          setError: (error) => set({ error }),
          clearError: () => set({ error: null }),
        },
      }),
      {
        name: 'practice-storage',
        storage: createJSONStorage(() => localStorage),
        version: 1,
        migrate: (persistedState) => Promise.resolve(persistedState),
        skipHydration: true,
        partialize: (state) => {
          const { actions, ...rest } = state;
          return rest;
        },
        onRehydrateStorage: () => (state) => {
          state?.actions?.setHydrated(true);
        },
      }
    ),
    { name: 'practice-store-devtools' }
  )
);

export const usePracticeActions = () => usePracticeStore((s) => s.actions);
export const useHasHydrated = () => usePracticeStore((s) => s.hasHydrated);
export const useSubmitted = () => usePracticeStore((s) => s.submitted);
export const useUser = () => usePracticeStore((s) => s.user);
export const useQuestions = () => usePracticeStore((s) => s.questions);
export const useSelectedSubject = () => usePracticeStore((s) => s.selectedSubject);
export const useCurrentQuestion = () => usePracticeStore((s) => s.currentQuestion);
export const useSelectedAnswers = () => usePracticeStore((s) => s.selectedAnswers);
export const useUnattemptedQuestions = () => usePracticeStore((s) => s.unattemptedQuestions);
export const useAiReviews = () => usePracticeStore((s) => s.aiReviews);
export const useGeneratingForQuestionId = () => usePracticeStore((s) => s.generatingForQuestionId);
export const useTotalNumberAttempted = () => usePracticeStore((s) => s.totalNumberAttempted);
export const useNumberAttempted = () => usePracticeStore((s) => s.numberAttempted);
export const useAttemptedQuestions = () => usePracticeStore((s) => s.attemptedQuestions);
export const useCountdown = () => usePracticeStore((s) => s.countdown);
export const useScore = () => usePracticeStore((s) => s.score);
export const useResultsFeedback = () => usePracticeStore((s) => s.resultsFeedback);
export const useTimeEnd = () => usePracticeStore((s) => s.timeEnd);
export const useSubmitPopup = () => usePracticeStore((s) => s.submitPopup);
export const useSelectedSubjects = () => usePracticeStore((s) => s.selectedSubjects);
export const useSelectedSubjectsParameters = () => usePracticeStore((s) => s.selectedSubjectsParameters);
export const useSubjectScores = () => usePracticeStore((s) => s.subjectScores);
export const useLoading = () => usePracticeStore((s) => s.loading);
export const useError = () => usePracticeStore((s) => s.error);
export const usePendingReview = () => usePracticeStore((s) => s.pendingReview);
export const useFetchData = () => usePracticeStore((s) => s.fetchData);
