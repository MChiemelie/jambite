'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { getPractices } from '@/services/analytics';
import { User } from '@/types';

function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function calculateStreaks() {
  const practices = await getPractices();

  if (!practices) {
    return { currentStreak: 0, longestStreak: 0, practiceDates: [] };
  }
  const practiceDates = Array.from(new Set(practices.map((p) => toDateKey(new Date(p.createdAt))))).sort();

  let longestStreak = 1;
  let currentStreak = 1;
  let streak = 1;

  for (let i = 1; i < practiceDates.length; i++) {
    const prev = new Date(practiceDates[i - 1]);
    const today = new Date(practiceDates[i]);

    const diffDays = Math.floor((+today - +prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      streak = 1;
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  const lastDate = new Date(practiceDates.at(-1)!);
  const diffFromToday = Math.floor((Date.now() - +lastDate) / (1000 * 60 * 60 * 24));

  if (diffFromToday === 0) {
    currentStreak = streak;
  } else if (diffFromToday === 1) {
    currentStreak = streak;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak, practiceDates };
}

export async function updateStreak(user: User, practicedToday: boolean) {
  const { databases } = await createSessionClient();

  const userData = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, user.$id);

  let { currentStreak, longestStreak, lastPractice } = userData;
  const now = new Date();
  const last = lastPractice ? new Date(lastPractice) : null;

  if (practicedToday) {
    if (!last || now.getTime() - last.getTime() > 24 * 60 * 60 * 1000) {
      currentStreak = 1;
    } else {
      currentStreak++;
    }
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  } else if (last) {
    // midnight after the missed day
    const resetDate = new Date(last);
    resetDate.setHours(0, 0, 0, 0); // midnight of last practice day
    resetDate.setDate(resetDate.getDate() + 2); // 2 days after last practice
    if (now >= resetDate) {
      currentStreak = 0;
    }
  }

  return await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, user.$id, {
    currentStreak,
    longestStreak,
    lastPractice: practicedToday ? now.toISOString() : lastPractice,
  });
}
