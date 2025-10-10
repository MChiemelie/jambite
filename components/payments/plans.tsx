import { plans } from '@/data';
import { handlePay } from '@/helpers/payments';
import { Check } from 'lucide-react';

export default function Plans() {
  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full text-sm md:text-md">
        {plans.map((plan) => (
          <div key={plan.id} className="p-2 md:p-4 w-full h-96">
            <div className={`h-full p-4 rounded border-2 ${plan.id === 'premium' ? 'border-accent-1' : 'border-foreground'} flex flex-col relative overflow-hidden`}>
              {plan.id === 'premium' && <span className="bg-brand text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>}
              <h2 className="text-xs tracking-widest title-font mb-1 uppercase">{plan.name}</h2>
              <h1 className="text-4xl pb-4 mb-4 border-b border-foreground leading-none">{plan.pricing.oneTime === 0 ? 'Free' : `₦ ${new Intl.NumberFormat('en-NG').format(plan.pricing.oneTime)}`}</h1>

              {plan.features.map((f) => (
                <p className="flex items-center mb-2" key={f}>
                  <Check className="w-4 h-4 p-1 mr-2 inline-flex rounded-full shrink-0" />
                  {f}
                </p>
              ))}

              <form action={handlePay} className="mt-auto w-full">
                <input type="hidden" name="planId" value={plan.id} />
                <button type="submit" disabled={plan.id === 'enterprise'} className="flex items-center bg-foreground text-background py-2 px-4 w-full rounded">
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
