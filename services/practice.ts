'use server';

import { ID } from 'appwrite';
import { appwriteConfig } from '@/config';
import { createSessionClient } from '@/libraries';
import { AIReview, PracticeData } from '@/types';
import { Performances, Practices } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const postPracticeData = async (practiceData: PracticeData) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();
    practiceData.userId = user.$id;

    const response = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.practicesCollectionId, practiceData.practiceId, practiceData);
    return response;
  } catch (error) {
    console.error('Error saving practice data:', error);
    throw new Error('Failed to save practice data');
  }
};

export const postPerformanceData = async (subjectPerformance) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const performanceData = {
      ...subjectPerformance,
      userId: user.$id,
    };

    const response = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.performancesCollectionId, ID.unique(), performanceData);
    return response;
  } catch (error) {
    console.error('Error saving subject performance data:', error);
    throw new Error('Failed to save subject performance data');
  }
};

export const getPerformance = async (): Promise<Performances[]> => {
  try {
    const { databases } = await createSessionClient();
    const { documents, total } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.performancesCollectionId);

    if (total === 0) {
      console.warn('No performance data found.');
      return [];
    }

    return documents.map((doc) => ({
      performanceId: doc.performanceId,
      userId: doc.userId,
      correct: doc.correct,
      attempts: doc.attempts,
      totalSubjectQuestions: doc.totalQuestions,
      subject: doc.subject,
      score: doc.score,
      practiceId: doc.practiceId,
      createdAt: doc.$createdAt,
    }));
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw new Error('Failed to fetch performance data.');
  }
};

export const getPractice = async (): Promise<Practices[]> => {
  try {
    const { databases } = await createSessionClient();
    const { documents, total } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.practicesCollectionId);

    if (total === 0) {
      console.warn('No practice data found.');
      return [];
    }

    return documents.map((doc) => ({
      practiceId: doc.practiceId,
      timestamp: doc.timestamp,
      duration: doc.duration,
      totalAttempts: doc.totalAttempts,
      totalQuestions: doc.totalQuestions,
      totalCorrect: doc.totalCorrect,
      totalScore: doc.totalScore,
      userId: doc.userId,
      createdAt: doc.$createdAt,
    }));
  } catch (error) {
    console.error('Error fetching practice data:', error);
    throw new Error('Failed to fetch practice data.');
  }
};

export async function getAIReview(data: AIReview) {
  const response = await fetch(`${BASE_URL}/api/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI review');
  }

  return response.json();
}
