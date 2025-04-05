import axios from 'axios';
import { NextResponse } from 'next/server';
import { subjectPathMap } from '@/data/subjects';
import { Question } from '@/types';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: Request) {
  try {
    const baseUrl = BASE_URL || 'http://localhost:3000';
    const { searchParams } = new URL(request.url, baseUrl);
    const subjects = searchParams.get('subjects')?.split(',') || [];
    const randomYear = searchParams.get('randomYear');

    const englishResponse = await axios.get(`https://questions.aloc.com.ng/api/v2/m/3?subject=english&year=${randomYear}&random=false&withComprehension=true`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: ACCESS_TOKEN,
      },
    });

    const englishQuestions: Question[] = englishResponse.data.data;

    const fetchedQuestions = await Promise.all(
      subjects.map(async (subject) => {
        try {
          const response = await axios.get(`https://questions.aloc.com.ng/api/v2/q/2?subject=${subject}`, {
            headers: {
              Accept: 'application/json',
              AccessToken: ACCESS_TOKEN,
              'Content-Type': 'application/json',
            },
          });
          return { subject: subjectPathMap[subject], questions: response.data.data };
        } catch (error) {
          console.error(`Failed to fetch questions for subject ${subject}:`, error);
          return { subject: subjectPathMap[subject], questions: [] };
        }
      })
    );

    const questionsBySubject: Record<string, Question[]> = fetchedQuestions.reduce(
      (acc, { subject, questions }) => {
        acc[subject] = questions;
        return acc;
      },
      { 'Use of English': englishQuestions }
    );

    return NextResponse.json(questionsBySubject);
  } catch (error) {
    console.error('Error processing GET /api/questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions.' }, { status: 500 });
  }
}
