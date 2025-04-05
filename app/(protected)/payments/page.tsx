import { ActivePayment, History, Plans, Subscription } from '@/components/payments';
import { getUserData } from '@/services';

export default async function PaymentsPage() {
  const user = await getUserData();
  const { trials } = user;

  return (
    <div className="mx-auto p-2 md:p-4 lg:p-6 gap-4 divide-y-2 w-full overflow-x-0">
      <ActivePayment user={user} />
      <Subscription />
      {trials === 0 && <Plans />}
      <History />
    </div>
  );
}
