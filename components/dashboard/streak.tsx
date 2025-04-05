'use client';

import * as React from 'react';
import { Calendar } from '@/components/shadcn/calendar';

export default function Streak() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return <Calendar mode="single" selected={date} onSelect={setDate} className="mx-auto rounded w-fit hidden sm:block" />;
}
