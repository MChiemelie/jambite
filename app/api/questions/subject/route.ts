'use server';

import { subjectPathMap } from '@/data/subjects';
import { Question } from '@/types';
import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error('ACCESS_TOKEN env var is required');
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const subjectParam = searchParams.get('name') ?? '';
  const count = parseInt(searchParams.get('count') ?? '40', 10);

  try {
    if (!subjectParam) {
      return NextResponse.json({ error: 'Subject name is required' }, { status: 400 });
    }

    const response: AxiosResponse<{ data: Question[] }> = await axios.get(`https://questions.aloc.com.ng/api/v2/q/${count}`, {
      params: { subject: subjectParam },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: ACCESS_TOKEN,
      },
    });

    const displayName = subjectPathMap[subjectParam] ?? subjectParam;

    return NextResponse.json({
      subject: displayName,
      questions: response.data.data,
    });
  } catch (err) {
    console.error(`Error fetching subject questions for ${subjectParam}:`, err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
