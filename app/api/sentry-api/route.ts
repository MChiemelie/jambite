export const dynamic = 'force-dynamic';

class SentryExampleAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}

export function GET(): never {
  throw new SentryExampleAPIError(
    'This error is raised on the backend called by the example page.'
  );
}
