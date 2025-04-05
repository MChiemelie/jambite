export function getFillColorForSubject(subject: string): string {
  switch (subject) {
    case 'Math':
      return 'var(--color-math)';
    case 'Physics':
      return 'var(--color-physics)';
    case 'Chemistry':
      return 'var(--color-chemistry)';
    case 'Biology':
      return 'var(--color-biology)';
    default:
      return 'var(--color-other)';
  }
}
