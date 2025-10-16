import { type NextRequest, NextResponse } from 'next/server';
import type { Question } from '@/types';

// Your Render API URL
const RENDER_API_URL = process.env.RENDER_API_URL || 'https://jambite-question-api.onrender.com';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;

    const subjects: string[] =
      searchParams
        .get('subjects')
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

    const randomYear = searchParams.get('randomYear') ?? '';

    // Forward the request to your Render API
    const queryParams = new URLSearchParams();
    if (subjects.length > 0) {
      queryParams.set('subjects', subjects.join(','));
    }
    if (randomYear) {
      queryParams.set('randomYear', randomYear);
    }

    const response = await fetch(`${RENDER_API_URL}/api/questions?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Increase timeout since Render might be cold starting
      signal: AbortSignal.timeout(60000) // 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Render API returned ${response.status}`);
    }

    const questionsBySubject: Record<string, Question[]> = await response.json();

    return NextResponse.json<Record<string, Question[]>>(questionsBySubject);
  } catch (err) {
    console.error('Error in GET /api/questions:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
