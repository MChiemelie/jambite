'use server';

import { ai } from '@/config/ai';
import { createAIChatStreamRouteHandlers } from 'next-ai-stream/server';

export const { GET, POST } = createAIChatStreamRouteHandlers({
  client: ai,
  model: 'gpt-4o-mini',
});
