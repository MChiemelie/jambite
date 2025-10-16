'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { getPractices } from '@/services/analytics';
import type { User } from '@/types';

function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getTodayKey(): string {
  return toDateKey(new Date());
}

function getDaysDifference(date1Key: string, date2Key: string): number {
  const d1 = new Date(date1Key);
  const d2 = new Date(date2Key);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export async function calculateStreaks() {
  const practices = await getPractices();

  if (!practices || practices.length === 0) {
    return { currentStreak: 0, longestStreak: 0, practiceDates: [] };
  }

  const practiceDates = Array.from(new Set(practices.map((p) => toDateKey(new Date(p.createdAt))))).sort();

  let longestStreak = 1;
  let streak = 1;

  // Calculate longest streak
  for (let i = 1; i < practiceDates.length; i++) {
    const daysDiff = getDaysDifference(practiceDates[i - 1], practiceDates[i]);

    if (daysDiff === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }

  // Calculate current streak
  const today = getTodayKey();
  const lastPracticeDate = practiceDates[practiceDates.length - 1];
  const daysSinceLastPractice = getDaysDifference(lastPracticeDate, today);

  let currentStreak = 0;

  if (daysSinceLastPractice <= 1) {
    // Count backwards from last practice to find current streak
    currentStreak = 1;
    for (let i = practiceDates.length - 2; i >= 0; i--) {
      const daysDiff = getDaysDifference(practiceDates[i], practiceDates[i + 1]);
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak, practiceDates };
}

export async function updateStreak(user: User, practicedToday: boolean) {
  const { databases } = await createSessionClient();
  const { currentStreak, longestStreak } = await calculateStreaks();

  return await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, user.$id, {
    currentStreak,
    longestStreak,
    lastPractice: practicedToday ? new Date().toISOString() : user.lastPractice
  });
}
