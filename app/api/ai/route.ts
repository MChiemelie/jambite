import { createAIChatStreamRouteHandlers } from 'next-ai-stream/server';
import { ai } from '@/config/ai';

export const { GET, POST } = createAIChatStreamRouteHandlers({
  client: ai,
  model: 'gpt-4o-mini'
});
