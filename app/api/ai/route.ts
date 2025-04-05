import { createAIChatStreamRouteHandlers } from 'next-ai-stream/server';
import { client } from '@/config';

export const dynamic = 'force-dynamic';

export const { GET, POST } = createAIChatStreamRouteHandlers({
  client,
  model: 'gpt-4o-mini',
});
