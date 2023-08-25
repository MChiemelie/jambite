import { createClient } from '@supabase/supabase-js';
import { Session } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabasePublicKey);

export type UserProfileData = {
  full_name: string;
  username: string;
  twitter: string;
  avatar_url: string;
};

export const fetchPerformanceData = async (session) => {
  try {
    const user = session?.user;

    if (!user) return;

    const currentUserId = user.id as string;

    const { data: scoreData, error: scoreError } = await supabase
      .from('quizzes')
      .select('score, subject')
      .eq('user_id', currentUserId);

    if (scoreError) {
      throw new Error('Error fetching score data.');
    }

    const bestScore =
      scoreData && scoreData.length > 0
        ? scoreData.reduce((max, item) => (item.score > max.score ? item : max), scoreData[0])
        : null;

    const { data: leastTimeData, error: leastTimeError } = await supabase
      .from('quizzes')
      .select('subject, time_taken')
      .eq('user_id', currentUserId)
      .order('time_taken', { ascending: true })
      .limit(1);

    if (leastTimeError) {
      throw new Error('Error fetching least time taken data.');
    }

    const leastTimeEntry = leastTimeData[0];
    const leastTimeTaken = leastTimeEntry?.time_taken;
    const leastTimeSubject = leastTimeEntry?.subject;

    const { data: averageScoreData, error: averageScoreError } = await supabase
      .from('quizzes')
      .select('score')
      .eq('user_id', currentUserId);

    if (averageScoreError) {
      throw new Error('Error fetching average score data.');
    }

    let totalScore = 0;
    if (averageScoreData && averageScoreData.length > 0) {
      totalScore = averageScoreData.reduce((sum, item) => sum + item.score, 0);
    }
    const averageScore = totalScore / (averageScoreData.length || 1);
    const roundedAverageScore = Math.round(averageScore);

    const subjectCounts = {};
    scoreData.forEach(item => {
      if (subjectCounts[item.subject]) {
        subjectCounts[item.subject]++;
      } else {
        subjectCounts[item.subject] = 1;
      }
    });
    const mostAttemptsSubject = Object.keys(subjectCounts).reduce(
      (maxSubject, subject) => (subjectCounts[subject] > subjectCounts[maxSubject] ? subject : maxSubject),
      Object.keys(subjectCounts)[0]
    );

    const totalCorrectAnswers = scoreData.reduce((sum, item) => sum + item.score, 0);
    const totalQuestions = scoreData.length * 40;
    const percentage = (totalCorrectAnswers / totalQuestions) * 100;

    return {
      bestScore,
      leastTimeTaken,
      leastTimeSubject,
      averageScore: roundedAverageScore,
      totalAttempts: scoreData.length,
      highestAttemptsSubject: mostAttemptsSubject,
      correctAnswersPercentage: percentage.toFixed(2),
    };
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const fetchUserProfile = async (session: Session | null): Promise<UserProfileData> => {
 try {
   const user = session?.user;

   if (!user) {
     throw new Error('User session is not available.');
   }

   const { data, error, status } = await supabase
     .from('profiles')
     .select(`full_name, username, twitter, avatar_url`)
     .eq('id', user.id)
     .single();

   if (error && status !== 406) {
     throw error;
   }

   return {
     full_name: data?.full_name || '',
     username: data?.username || '',
     twitter: data?.twitter || '',
     avatar_url: data?.avatar_url || '',
   };
 } catch (error) {
   console.log('Error loading user data:', error);
   throw error;
 }
};

export const updateProfile = async ({
 session,
 username,
 fullname,
 twitter,
 avatar_url,
}: {
 session: Session;
 username: string | null;
 fullname: string | null;
 twitter: string | null;
 avatar_url: string | null;
}): Promise<void> => {
  try {
    const user = session?.user;

    if (!user) {
      throw new Error('User session is not available.');
    }

    const { data, error } = await supabase.from('profiles').upsert({
      id: user.id as string,
      full_name: fullname,
      username,
      twitter,
      avatar_url,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.log('Error updating profile:', error);
    } else {
      console.log('Profile updated:', data);
      alert('Profile updated!');
    }
  } catch (error) {
    console.log('Error updating the data!', error);
    throw error;
  }
};