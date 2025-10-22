'use client';

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import {
  selectAnswer,
  setAIReview,
  setQuestions,
  setUnattemptedQuestions,
  submitPractice
} from '@/helpers/practice';
import type { PracticeActions, PracticeStore } from '@/types';

const initialState: PracticeStore = {
  initialCountdown: 1200,
  countdown: 1200,
  totalQuestions: 0,
  duration: 0,
  unattemptedQuestions: {},
  currentQuestion: 0,
  selectedAnswers: {},
  aiReviews: {},
  totalNumberAttempted: 0,
  numberAttempted: {},
  attemptedQuestions: {},
  submitted: false,
  totalCorrect: 0,
  resultsFeedback: {},
  timeEnd: false,
  submitPopup: false,
  selectedSubjects: [],
  selectedSubjectsParameters: [],
  questions: {},
  subjectScores: {},
  totalScore: 0,
  loading: false,
  error: null,
  user: null,
  pendingReview: null,
  selectedSubject: 'Use of English',
  hasHydrated: false,
  fetchData: true,
  fetchProgress: 0,
  awaitingCountdown: 0
};

export const usePracticeStore = create<
  PracticeStore & { actions: PracticeActions }
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        actions: {
          setHydrated: (v) => set({ hasHydrated: v }),
          setFetchData: (v) => set({ fetchData: v }),
          setFetchProgress: (progress) => set({ fetchProgress: progress }),
          setAwaitingCountdown: (seconds) =>
            set({ awaitingCountdown: seconds }),
          setUser: (user) => set({ user }),
          setSelectedSubjects: (selectedSubjects) => set({ selectedSubjects }),
          setSelectedSubjectsParameters: (selectedSubjectsParameters) =>
            set({ selectedSubjectsParameters }),
          setTotalCorrect: (totalCorrect) => set({ totalCorrect }),
          setTotalQuestions: (totalQuestions) => set({ totalQuestions }),
          setTotalScore: (totalScore) => set({ totalScore }),
          setDuration: (duration) => set({ duration }),
          setSubjectScores: (subjectScores) => set({ subjectScores }),
          nextQuestion: () =>
            set((s) => ({ currentQuestion: s.currentQuestion + 1 })),
          previousQuestion: () =>
            set((s) => ({
              currentQuestion: Math.max(0, s.currentQuestion - 1)
            })),
          setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
          setSubmitted: (submitted) => set({ submitted }),
          timeEnded: async () => {
            const state = get();
            if (state.submitted || state.timeEnd) {
              return;
            }

            set({ timeEnd: true });

            await get().actions.submitPractice();
          },
          setCountdown: (countdown) => {
            if (typeof countdown === 'function') {
              set((state) => ({ countdown: countdown(state.countdown) }));
            } else {
              set({ countdown });
            }
          },
          setResultsFeedback: (resultsFeedback) => set({ resultsFeedback }),
          setSubmitPopup: (v) => set({ submitPopup: v }),
          selectAnswer: ({ questionId, selectedOption, subject }) =>
            set(
              (s) => selectAnswer(s, questionId, selectedOption, subject) || {}
            ),
          setQuestions: (payload) => set((s) => setQuestions(s, payload)),
          submitPractice: async () => {
            const state = get();

            if (state.submitted) {
              return;
            }
            await submitPractice(get, set);
          },
          setAiReview: ({ subject, questionId, review }) =>
            set((s) => setAIReview(s, subject, questionId, review)),
          setUnattemptedQuestions: (subject, questionId) =>
            set((s) => setUnattemptedQuestions(s, subject, questionId)),
          setPendingReview: (pendingReview) => set({ pendingReview }),
          setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
          reset: () => set({ ...initialState }),
          setError: (error) => set({ error }),
          clearError: () => set({ error: null })
        }
      }),
      {
        name: 'practice-storage',
        storage: createJSONStorage(() => localStorage),
        version: 1,
        migrate: (persistedState) => Promise.resolve(persistedState),
        skipHydration: true,
        partialize: (state) => {
          const { actions, countdown, fetchData, ...rest } = state;
          return rest;
        },
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.countdown = state.initialCountdown || 1200;
            state.fetchData = false;
          }
          state?.actions?.setHydrated(true);
        }
      }
    ),
    { name: 'practice-store-devtools' }
  )
);

export const usePracticeActions = () => usePracticeStore((s) => s.actions);
export const useHasHydrated = () => usePracticeStore((s) => s.hasHydrated);
export const useSubmitted = () => usePracticeStore((s) => s.submitted);
export const useQuestions = () => usePracticeStore((s) => s.questions);
export const useSelectedSubject = () =>
  usePracticeStore((s) => s.selectedSubject);
export const useCurrentQuestion = () =>
  usePracticeStore((s) => s.currentQuestion);
export const useSelectedAnswers = () =>
  usePracticeStore((s) => s.selectedAnswers);
export const useUnattemptedQuestions = () =>
  usePracticeStore((s) => s.unattemptedQuestions);
export const useAiReviews = () => usePracticeStore((s) => s.aiReviews);
export const useTotalNumberAttempted = () =>
  usePracticeStore((s) => s.totalNumberAttempted);
export const useNumberAttempted = () =>
  usePracticeStore((s) => s.numberAttempted);
export const useTotalQuestions = () =>
  usePracticeStore((s) => s.totalQuestions);
export const useCountdown = () => usePracticeStore((s) => s.countdown);
export const useDuration = () => usePracticeStore((s) => s.duration);
export const useTotalCorrect = () => usePracticeStore((s) => s.totalCorrect);
export const useTotalScore = () => usePracticeStore((s) => s.totalScore);
export const useResultsFeedback = () =>
  usePracticeStore((s) => s.resultsFeedback);
export const useTimeEnd = () => usePracticeStore((s) => s.timeEnd);
export const useSubmitPopup = () => usePracticeStore((s) => s.submitPopup);
export const useSelectedSubjects = () =>
  usePracticeStore((s) => s.selectedSubjects);
export const useSelectedSubjectsParameters = () =>
  usePracticeStore((s) => s.selectedSubjectsParameters);
export const useSubjectScores = () => usePracticeStore((s) => s.subjectScores);
export const usePendingReview = () => usePracticeStore((s) => s.pendingReview);
export const useFetchData = () => usePracticeStore((s) => s.fetchData);
export const useFetchProgress = () => usePracticeStore((s) => s.fetchProgress);
export const useAwaitingCountdown = () =>
  usePracticeStore((s) => s.awaitingCountdown);
