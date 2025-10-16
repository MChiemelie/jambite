'use server';

import { Query } from 'node-appwrite';
import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { getUserData } from '@/services';
import type { Performance, Practice } from '@/types';

const DEFAULT_LIMIT = 100;

const toNumber = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const safeString = (v: unknown, fallback = 'Unknown') => (v == null ? fallback : String(v));

async function fetchAllDocuments(databases: any, collectionId: string, baseQueries: any[] = []) {
  const all: any[] = [];
  let offset = 0;

  while (true) {
    const queries = [...baseQueries, Query.limit(DEFAULT_LIMIT), Query.offset(offset)];
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, collectionId, queries);

    if (!documents || documents.length === 0) break;

    all.push(...documents);

    if (documents.length < DEFAULT_LIMIT) break;
    offset += DEFAULT_LIMIT;
  }

  return all;
}

export const getPerformances = async (): Promise<Performance[]> => {
  try {
    const { databases } = await createSessionClient();
    const { userId } = await getUserData();

    if (!userId) return [];

    const raw = await fetchAllDocuments(databases, appwriteConfig.performancesCollectionId, [Query.equal('userId', [userId]), Query.orderDesc('$createdAt')]);

    return raw.map((doc: any) => {
      const data = doc.data ?? doc;
      return {
        performanceId: String(doc.$id ?? data.performanceId ?? ''),
        userId: String(data.userId ?? ''),
        correct: toNumber(data.correct, 0),
        attempts: toNumber(data.attempts, 0),
        totalQuestions: toNumber(data.totalQuestions, 0),
        subject: safeString(data.subject, 'Unknown'),
        score: toNumber(data.score, 0),
        practiceId: safeString(data.practiceId ?? data.practiceId, ''),
        createdAt: String(doc.$createdAt ?? data.createdAt ?? '')
      } as Performance;
    });
  } catch (err) {
    console.error('getPerformances error', err);
    return [];
  }
};

export const getPractices = async (): Promise<Practice[]> => {
  try {
    const { databases } = await createSessionClient();
    const { userId } = await getUserData();

    if (!userId) return [];

    const raw = await fetchAllDocuments(databases, appwriteConfig.practicesCollectionId, [Query.equal('userId', [userId]), Query.orderDesc('$createdAt')]);

    return raw.map((doc: any) => {
      const data = doc.data ?? doc;
      return {
        practiceId: String(doc.$id ?? data.practiceId ?? ''),
        timestamp: safeString(data.timestamp ?? data.$timestamp ?? ''),
        duration: toNumber(data.duration, 0),
        totalAttempts: toNumber(data.totalAttempts ?? data.attempts, 0),
        totalQuestions: toNumber(data.totalQuestions, 0),
        totalCorrect: toNumber(data.totalCorrect, 0),
        totalScore: toNumber(data.totalScore, 0),
        userId: String(data.userId ?? ''),
        createdAt: String(doc.$createdAt ?? data.createdAt ?? '')
      } as Practice;
    });
  } catch (err) {
    console.error('getPractices error', err);
    return [];
  }
};
