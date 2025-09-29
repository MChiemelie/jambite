import { Calendar } from '@/components/shadcn/calendar';
import { calculateStreaks } from '@/helpers/streak';

export default async function Streak() {
  const { practiceDates } = await calculateStreaks();
  const practiceDays = practiceDates.map((d) => new Date(d));

  return <Calendar mode="default" selected={practiceDays} className="mx-auto rounded w-fit" />;
}
