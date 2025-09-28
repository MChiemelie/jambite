import { ActivePayment, History, Plans } from '@/components/payments';
import { getUserData } from '@/services';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const user = await getUserData();
  const { trials } = user;

  return (
    <section className="flex flex-col mx-auto p-2 md:p-4 lg:p-6 gap-10 divide-y-2 w-full overflow-x-0">
      {trials === 0 ? <Plans /> : <ActivePayment user={user} />}
      <History />
    </section>
  );
}
