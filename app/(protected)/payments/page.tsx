import { ActivePayment, History, Plans } from '@/components/payments';
import { getUserData } from '@/services';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const user = await getUserData();
  const { trials } = user;

  return (
    <section className='flex flex-col gap-10'>
      <figure className='quote text-center'>
        <blockquote>
          <span className='text-2xl'>💸</span>
          <h1 className='text-lg font-bold italic'>“If you think education is expensive, try ignorance.”</h1>
        </blockquote>
        <figcaption>
          <cite>
            — Derek Bok, <em>President of Harvard University</em>
          </cite>
        </figcaption>
      </figure>
      <div className='overflow-x-0 mx-auto flex w-full flex-col gap-10 divide-y-2 p-2 md:p-4 lg:p-6'>
        {trials === 0 ? <Plans /> : <ActivePayment user={user} />}
        <History />
      </div>
    </section>
  );
}
