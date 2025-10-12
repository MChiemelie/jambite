'use server';

import { redirect } from 'next/navigation';
import { getUserData } from '@/services';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getQuestions(subjects: string[], randomYear: string) {
  try {
    const { trials } = await getUserData();

    if (trials === 0) {
      redirect('/payments');
    }

    const queryParams = new URLSearchParams({
      subjects: subjects.join(','),
      randomYear
    }).toString();

    const response = await fetch(`${BASE_URL}/api/questions?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw error;
  }
}
