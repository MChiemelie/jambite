import { PracticeActions, PracticeStore } from '@/types';
import { postPracticeData, postPerformanceData } from '@/services/practice';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '@/types';

export function selectAnswer(s: PracticeStore, questionId: number, selectedOption: string, subject: string) {
  const attempted = { ...s.attemptedQuestions };
  const numberAtt = { ...s.numberAttempted };
  let total = s.totalNumberAttempted;

  if (!s.questions[subject]?.some((q) => q.id === questionId)) {
    console.error(`Question ID ${questionId} not in subject ${subject}`);
    return null;
  }

  if (!attempted[questionId]) {
    attempted[questionId] = true;
    total += 1;
    numberAtt[subject] = (numberAtt[subject] || 0) + 1;
  }

  return {
    selectedAnswers: { ...s.selectedAnswers, [questionId]: selectedOption },
    attemptedQuestions: attempted,
    numberAttempted: numberAtt,
    totalNumberAttempted: total,
  };
}


export function setQuestions(s: PracticeStore, payload: PracticeStore['questions']) {
  const merged = { ...s.questions, ...payload };
  const ids = Object.values(merged)
    .flat()
    .map((q) => q.id);
  if (new Set(ids).size !== ids.length) {
    console.error('Duplicate Question IDs');
  }

  const unattempt = { ...s.unattemptedQuestions };
  Object.entries(payload).forEach(([subject, qs]) => {
    if (!unattempt[subject]) unattempt[subject] = qs.map((q) => q.id);
  });

  return { questions: merged, unattemptedQuestions: unattempt };
}

export const generateFeedbackMessage = (userAnswer: string, correctAnswer: string): { type: string; userAnswer?: string; correctAnswer: string } => ({
  type: userAnswer === correctAnswer ? 'correct' : userAnswer ? 'incorrect' : 'unattempted',
  userAnswer: userAnswer.toUpperCase(),
  correctAnswer: correctAnswer.toUpperCase(),
});

export const calculateScores = (subjects: string[], questions: Record<string, Question[]>, selectedAnswers: Record<number, string>) => {
  const feedback: Record<number, { type: string; userAnswer?: string; correctAnswer: string }> = {};
  const subjectScores: Record<string, number> = {};
  let totalScore = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  subjects.forEach((subject) => {
    const qs = questions[subject] || [];
    totalQuestions += qs.length;
    const correctCount = qs.reduce((count, q) => {
      const ua = (selectedAnswers[q.id] || '').toLowerCase();
      const ca = q.answer.toLowerCase();
      feedback[q.id] = generateFeedbackMessage(ua, ca);
      if (ua === ca) {
        totalCorrect++;
        return count + 1;
      }
      return count;
    }, 0);
    subjectScores[subject] = correctCount;
    totalScore += correctCount;
  });

  return { feedback, subjectScores, totalScore, totalCorrect, totalQuestions };
};

// Submit practice, update state via set and actions
export async function submitPractice(get: () => PracticeStore & { actions: PracticeActions }, set: (partial: Partial<PracticeStore>) => void) {
  const s = get();
  if (!s.user?.$id) {
    console.error('User missing');
    set({ error: 'User not logged in.' });
    return;
  }

  set({ loading: true, error: null });

  const subjects = [...s.selectedSubjects, s.selectedSubject];
  const { feedback, subjectScores, totalScore, totalCorrect, totalQuestions } = calculateScores(subjects, s.questions, s.selectedAnswers);

  try {
    const practiceId = uuidv4();
    await postPracticeData({
      practiceId,
      timestamp: new Date().toISOString(),
      duration: 1200 - s.countdown,
      feedback: 'It was good',
      userId: s.user.$id,
      subjects: JSON.stringify(subjects.map((sub) => ({ subject: sub, correct: subjectScores[sub], totalQuestions }))),
      completed: true,
      totalScore,
      totalCorrect,
      totalQuestions,
      totalAttempts: s.totalNumberAttempted,
    });

    await Promise.all(
      Object.entries(subjectScores).map(([subject, correct]) =>
        postPerformanceData({
          performanceId: uuidv4(),
          practiceId,
          subject,
          correct,
          attempts: s.numberAttempted[subject] || 0,
          totalQuestions: s.questions[subject]?.length || 0,
          score: Math.round((correct / Math.max(1, s.questions[subject]?.length || 1)) * 100),        })
      )
    );

    // Use the action to update resultsFeedback
    s.actions.setResultsFeedback(feedback);

    // Now mark submitted and save scores
    set({ submitted: true, submitPopup: true, score: totalScore, subjectScores });
  } catch (err) {
    console.error('Submission failed', err);
    set({ error: 'Submission failed. Try again.' });
  } finally {
    set({ loading: false });
  }
}

export function setAIReview(s: PracticeStore, subject: string, questionId: number, review: string) {
  return {
    aiReviews: {
      ...s.aiReviews,
      [subject]: { ...(s.aiReviews[subject] || {}), [questionId]: review },
    },
  };
}


export function setUnattemptedQuestions(s: PracticeStore, subject: string, questionId: number) {
  return {
    unattemptedQuestions: {
      ...s.unattemptedQuestions,
      [subject]: (s.unattemptedQuestions[subject] || []).filter((id) => id !== questionId),
    },
  };
}
