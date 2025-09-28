'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { AIReview, CreatePerformance, CreatePractice, Performance, Practice } from '@/types';
import { ID, Models } from 'node-appwrite';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const postPractice = async (practiceData: CreatePractice) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const doc = {
      ...practiceData,
      userId: user.$id,
    };

    return await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.practicesCollectionId, ID.unique(), doc);
  } catch (error) {
    console.error('Error saving practice data:', error);
    throw new Error('Failed to save practice data');
  }
};

export const postPerformance = async (performance: CreatePerformance): Promise<Models.Document> => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const performanceData = {
      ...performance,
      userId: user.$id,
    };

    const response = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.performancesCollectionId, ID.unique(), performanceData);
    return response;
  } catch (error) {
    console.error('Error saving subject performance data:', error);
    throw new Error('Failed to save subject performance data');
  }
};
