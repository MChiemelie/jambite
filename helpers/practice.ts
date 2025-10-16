import { v4 as uuidv4 } from 'uuid';
import { postPerformance, postPractice } from '@/services/practice';
import type { PracticeActions, PracticeStore, Question } from '@/types';
import { updateStreak } from './streak';

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
    totalNumberAttempted: total
  };
}

export function setQuestions(s: PracticeStore, payload: PracticeStore['questions']) {
  const merged = { ...s.questions, ...payload };
  const ids = Object.values(merged)
    .flat()
    .map((q) => q.id);
  if (new Set(ids).size !== ids.length) console.log('Duplicate Question IDs');

  const unattempt = { ...s.unattemptedQuestions };
  Object.entries(payload).forEach(([subject, qs]) => {
    if (!unattempt[subject]) unattempt[subject] = qs.map((q) => q.id);
  });

  return { questions: merged, unattemptedQuestions: unattempt };
}

const generateFeedbackMessage = (ua: string, ca: string) => ({
  type: ua === ca ? 'correct' : ua ? 'incorrect' : 'unattempted',
  userAnswer: ua.toUpperCase(),
  correctAnswer: ca.toUpperCase()
});

const calculateScores = (subjects: string[], questions: Record<string, Question[]>, selectedAnswers: Record<number, string>) => {
  const feedback: Record<number, any> = {};
  const subjectScores: Record<string, number> = {};
  let totalScore = 0,
    totalCorrect = 0,
    totalQuestions = 0;

  subjects.forEach((sub) => {
    const qs = questions[sub] || [];
    totalQuestions += qs.length;
    const correctCount = qs.reduce((cnt, q) => {
      const ua = (selectedAnswers[q.id] || '').toLowerCase();
      const ca = q.answer.toLowerCase();
      feedback[q.id] = generateFeedbackMessage(ua, ca);
      if (ua === ca) {
        totalCorrect++;
        return cnt + 1;
      }
      return cnt;
    }, 0);
    subjectScores[sub] = correctCount;
    totalScore += correctCount;
  });

  return { feedback, subjectScores, totalCorrect, totalQuestions };
};

export async function submitPractice(get: () => PracticeStore & { actions: PracticeActions }, set: (partial: Partial<PracticeStore>) => void) {
  const s = get();
  const { questions, countdown, user, initialCountdown } = s;

  if (!user?.$id) {
    console.error('User missing');
    set({ error: 'User not logged in.' });
    return;
  }

  const subjects = Array.from(new Set([...Object.keys(s.questions), ...(Array.isArray(s.selectedSubjects) ? s.selectedSubjects : []), ...(s.selectedSubject ? [s.selectedSubject] : [])]));

  set({ loading: true, error: null });

  const { feedback, subjectScores, totalCorrect, totalQuestions } = calculateScores(subjects, s.questions, s.selectedAnswers);

  const totalScore = Object.keys(subjectScores).reduce((acc, subject) => {
    const totalForSubject = questions[subject]?.length || 0;
    if (totalForSubject > 0) {
      const percentage = Number(((subjectScores[subject] / totalForSubject) * 100).toFixed());
      return acc + percentage;
    }
    return acc;
  }, 0);

  const duration = initialCountdown - countdown;

  try {
    const practiceId = uuidv4();

    await postPractice({
      timestamp: new Date().toISOString(),
      duration,
      feedback: '',
      userId: user.$id,
      completed: true,
      totalScore,
      totalCorrect,
      totalQuestions,
      totalAttempts: s.totalNumberAttempted
    });

    await Promise.all(
      Object.entries(subjectScores).map(async ([sub, correct]) => {
        try {
          await postPerformance({
            userId: user.$id,
            practiceId,
            subject: sub,
            correct,
            attempts: s.numberAttempted[sub] || 0,
            totalQuestions: s.questions[sub]?.length || 0,
            score: Math.round((correct / Math.max(1, s.questions[sub]?.length || 1)) * 100)
          });
        } catch (e) {
          console.error(`Perf post failed for ${sub}`, e);
        }
      })
    );

    await updateStreak(user, true);

    s.actions.setResultsFeedback(feedback);
    set({
      submitted: true,
      submitPopup: true,
      totalCorrect,
      totalScore,
      subjectScores,
      duration,
      totalQuestions
    });
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
      [subject]: { ...(s.aiReviews[subject] || {}), [questionId]: review }
    }
  };
}

export function setUnattemptedQuestions(s: PracticeStore, subject: string, questionId: number) {
  return {
    unattemptedQuestions: {
      ...s.unattemptedQuestions,
      [subject]: (s.unattemptedQuestions[subject] || []).filter((id) => id !== questionId)
    }
  };
}
