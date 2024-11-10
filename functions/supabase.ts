import { createClient } from '@/services/supabase/client';
import { Session } from '@supabase/auth-helpers-nextjs';

export type UserProfileData = {
  full_name: string;
  username: string;
  twitter: string;
  avatar_url: string;
};



export const fetchPerformanceData = async (session: Session | null) => {
  const supabase = await createClient();

  try {
    const user = session?.user;

    if (!user) return null;

    const currentUserId = user.id as string;

    // Fetch the top 5 scores and their subjects
    const { data: topScoresData, error: topScoresError } = await supabase.from('quizzes').select('score, subject').eq('user_id', currentUserId).order('score', { ascending: false }).limit(5);

    if (topScoresError) {
      throw new Error('Error fetching top scores data.');
    }

    // Fetch the 5 subjects with the least time taken
    const { data: leastTimeData, error: leastTimeError } = await supabase.from('quizzes').select('time_taken, subject').eq('user_id', currentUserId).order('time_taken', { ascending: true }).limit(5);

    if (leastTimeError) {
      throw new Error('Error fetching least time data.');
    }

    // Determine the subjects with the most attempts
    const { data: allSubjectsData, error: allSubjectsError } = await supabase.from('quizzes').select('subject').eq('user_id', currentUserId);

    if (allSubjectsError) {
      throw new Error('Error fetching all subjects data.');
    }

    const subjectCounts: Record<string, number> = {};
    allSubjectsData.forEach((item) => {
      subjectCounts[item.subject] = (subjectCounts[item.subject] || 0) + 1;
    });

    const mostAttemptedSubjects = Object.keys(subjectCounts)
      .map((subject) => ({
        subject,
        attempts: subjectCounts[subject]
      }))
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 5); // Get top 5 most attempted subjects

    return {
      topScores: topScoresData,
      leastTime: leastTimeData,
      mostAttemptedSubjects
    };
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

export const fetchUserProfile = async (session: Session | null): Promise<UserProfileData> => {
  const supabase = await createClient();
  try {
    const user = session?.user;

    if (!user) {
      throw new Error('User session is not available.');
    }

    const { data, error, status } = await supabase.from('profiles').select(`full_name, username, twitter, avatar_url`).eq('id', user.id).single();

    if (error && status !== 406) {
      throw error;
    }

    return {
      full_name: data?.full_name || '',
      username: data?.username || '',
      twitter: data?.twitter || '',
      avatar_url: data?.avatar_url || ''
    };
  } catch (error) {
    console.log('Error loading user data:', error);
    throw error;
  }
};

export const updateProfile = async ({ session, username, fullname, twitter, avatar_url }: { session: Session; username: string | null; fullname: string | null; twitter: string | null; avatar_url: string | null }): Promise<void> => {
  const supabase = await createClient();
  try {
    const user = session?.user;

    if (!user) {
      throw new Error('User session is not available.');
    }

    const { data, error } = await supabase.from('profiles').upsert({ id: user.id as string, full_name: fullname, username, twitter, avatar_url, updated_at: new Date().toISOString() });

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
