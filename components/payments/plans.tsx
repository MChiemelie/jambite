import { Check } from 'lucide-react';
import { plans } from '@/data';
import { handlePay } from '@/helpers/payments';

export default function Plans() {
  return (
    <section className='flex flex-col gap-4'>
      <div className='md:text-md grid w-full grid-cols-1 text-sm md:grid-cols-2 lg:grid-cols-4'>
        {plans.map((plan) => (
          <div key={plan.id} className='h-96 w-full p-2 md:p-4'>
            <div className={`h-full rounded border-2 p-4 ${plan.id === 'premium' ? 'border-accent-1' : 'border-foreground'} relative flex flex-col overflow-hidden`}>
              {plan.id === 'premium' && <span className='bg-brand absolute top-0 right-0 rounded-bl px-3 py-1 text-xs tracking-widest text-white'>POPULAR</span>}
              <h2 className='title-font mb-1 text-xs tracking-widest uppercase'>{plan.name}</h2>
              <h1 className='border-foreground mb-4 border-b pb-4 text-4xl leading-none'>{plan.pricing.oneTime === 0 ? 'Free' : `₦ ${new Intl.NumberFormat('en-NG').format(plan.pricing.oneTime)}`}</h1>

              {plan.features.map((f) => (
                <p className='mb-2 flex items-center' key={f}>
                  <Check className='mr-2 inline-flex h-4 w-4 shrink-0 rounded-full p-1' />
                  {f}
                </p>
              ))}

              <form action={handlePay} className='mt-auto w-full'>
                <input type='hidden' name='planId' value={plan.id} />
                <button type='submit' disabled={plan.id === 'enterprise'} className='bg-foreground text-background flex w-full items-center rounded px-4 py-2'>
                  {plan.buttonText}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
