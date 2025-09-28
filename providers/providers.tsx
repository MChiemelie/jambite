'use client';

import { Table, Theme } from '@/providers';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme>
      <Table>{children}</Table>
    </Theme>
  );
}
