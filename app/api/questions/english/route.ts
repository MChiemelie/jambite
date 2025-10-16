'use server';

import axios, { type AxiosResponse } from 'axios';
import { type NextRequest, NextResponse } from 'next/server';
import type { Question } from '@/types';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error('ACCESS_TOKEN env var is required');
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ?? '';
    const count = parseInt(searchParams.get('count') ?? '60', 10);

    const response: AxiosResponse<{ data: Question[] }> = await axios.get(`https://questions.aloc.com.ng/api/v2/m/${count}`, {
      params: {
        subject: 'english',
        year,
        random: false,
        withComprehension: true
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: ACCESS_TOKEN
      }
    });

    return NextResponse.json({ questions: response.data.data });
  } catch (err) {
    console.error('Error fetching English questions:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
