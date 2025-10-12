'use server';

import axios, { type AxiosResponse } from 'axios';
import { type NextRequest, NextResponse } from 'next/server';
import { subjectPathMap } from '@/data/subjects';
import type { Question } from '@/types';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!ACCESS_TOKEN) {
  throw new Error('ACCESS_TOKEN env var is required');
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const baseUrl = BASE_URL ?? 'http://localhost:3000';
    const { searchParams } = new URL(request.url, baseUrl);

    const subjects: string[] =
      searchParams
        .get('subjects')
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

    const randomYear = searchParams.get('randomYear') ?? '';

    const englishResp: AxiosResponse<{ data: Question[] }> = await axios.get(
      `https://questions.aloc.com.ng/api/v2/m/12`,
      {
        params: {
          subject: 'english',
          year: randomYear,
          random: false,
          withComprehension: true
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          AccessToken: ACCESS_TOKEN
        }
      }
    );
    const englishQuestions: Question[] = englishResp.data.data;

    type Fetched = { subject: string; questions: Question[] };
    const fetched: Fetched[] = await Promise.all(
      subjects.map(async (subj): Promise<Fetched> => {
        try {
          const resp: AxiosResponse<{ data: Question[] }> = await axios.get(
            `https://questions.aloc.com.ng/api/v2/q/8`,
            {
              params: { subject: subj },
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                AccessToken: ACCESS_TOKEN
              }
            }
          );
          return {
            subject: subjectPathMap[subj] ?? subj,
            questions: resp.data.data
          };
        } catch (err) {
          console.error(`Failed to fetch for ${subj}:`, err);
          return { subject: subjectPathMap[subj] ?? subj, questions: [] };
        }
      })
    );

    // build the record; start with English
    const questionsBySubject: Record<string, Question[]> = fetched.reduce(
      (acc, { subject, questions }) => {
        acc[subject] = questions;
        return acc;
      },
      { 'Use of English': englishQuestions } as Record<string, Question[]>
    );

    return NextResponse.json<Record<string, Question[]>>(questionsBySubject);
  } catch (err) {
    console.error('Error in GET /api/questions:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
