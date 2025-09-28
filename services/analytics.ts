'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { Performance, Practice } from '@/types';
import { Query } from 'node-appwrite';

export const getPerformances = async (): Promise<Performance[]> => {
  // try {
  const { databases } = await createSessionClient();
  const limit = 100;
  let offset = 0;
  let allDocs: Performance[] = [];
  let hasMore = true;

  while (hasMore) {
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.performancesCollectionId, [Query.limit(limit), Query.offset(offset)]);

    const batch = documents.map((doc) => ({
      performanceId: doc.$id,
      userId: doc.userId,
      correct: doc.correct,
      attempts: doc.attempts,
      totalQuestions: doc.totalQuestions,
      subject: doc.subject,
      score: doc.score,
      practiceId: doc.practiceId,
      createdAt: doc.$createdAt,
    }));

    allDocs.push(...batch);
    offset += limit;
    hasMore = documents.length === limit;
  }

  return allDocs;
  // } catch (error) {
  //   console.error('Error fetching performance data:', error);
  //   throw new Error('Failed to fetch performance data.');
  // }
};

export const getPractices = async (): Promise<Practice[]> => {
  // try {
  const { databases } = await createSessionClient();
  const limit = 100;
  let offset = 0;
  let allDocs: Practice[] = [];
  let hasMore = true;

  while (hasMore) {
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.practicesCollectionId, [Query.limit(limit), Query.offset(offset)]);

    const batch = documents.map((doc) => ({
      practiceId: doc.$id,
      timestamp: doc.timestamp,
      duration: doc.duration,
      totalAttempts: doc.totalAttempts,
      totalQuestions: doc.totalQuestions,
      totalCorrect: doc.totalCorrect,
      totalScore: doc.totalScore,
      userId: doc.userId,
      createdAt: doc.$createdAt,
    }));

    allDocs.push(...batch);
    offset += limit;
    hasMore = documents.length === limit;
  }

  return allDocs;
  // } catch (error) {
  //   console.error('Error fetching practice data:', error);
  //   throw new Error('Failed to fetch practice data.');
  // }
};
