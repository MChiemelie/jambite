'use client';

import { useState } from 'react';
import { plans } from '@/data';
import { makePayment } from '@/services/payments';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Plans() {
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handlePayment = async (plan: any) => {
    const amount = plan.pricing.oneTime * 100;

    if (amount === 0) {
      router.push('/dashboard');
      return;
    }

    setProcessing((prev) => ({ ...prev, [plan.id]: true }));
    try {
      const paymentData = await makePayment(amount);
      if (paymentData?.data?.authorization_url) {
        window.location.href = paymentData.data.authorization_url;
      }
    } catch (error) {
      console.error('Error during one-time payment:', error);
    } finally {
      setProcessing((prev) => ({ ...prev, [plan.id]: false }));
    }
  };

  const proPlan = plans.find((plan) => plan.id === 'pro');
  const proPracticeFeature = proPlan ? '1 Practice' : '';

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full text-sm md:text-md">
        {plans.map((plan) => (
          <div className="p-2 md:p-4 w-full h-96" key={plan.id}>
            <div className={`h-full p-4 rounded border-2 ${plan.id === 'premium' ? 'border-accent-1' : 'border-foreground'} flex flex-col relative overflow-hidden`}>
              {plan.id === 'premium' && <span className="bg-brand text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>}
              <h2 className="text-xs tracking-widest title-font mb-1 uppercase">{plan.name}</h2>
              <h1 className="text-4xl pb-4 mb-4 border-b border-foreground leading-none">{plan.pricing.oneTime === 0 ? 'Free' : `₦ ${new Intl.NumberFormat('en-NG').format(plan.pricing.oneTime)}`}</h1>
              {plan.features.map((feature) => (
                <p className="flex items-center mb-2" key={feature}>
                  <Check className="w-4 h-4 p-1 mr-2 inline-flex items-center justify-center ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg text-accent-1 rounded-full shrink-0" />
                  {feature}
                </p>
              ))}
              {plan.id === 'pro' && (
                <p className="flex items-center mb-2">
                  <Check className="w-4 h-4 p-1 mr-2 inline-flex items-center justify-center ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg text-accent-1 rounded-full shrink-0" />
                  {proPracticeFeature}
                </p>
              )}
              <button onClick={() => handlePayment(plan)} disabled={processing[plan.id] || plan.id === 'enterprise'} className="flex items-center mt-auto bg-foreground text-background border-0 py-2 px-4 w-full focus:outline-hidden rounded">
                {processing[plan.id] ? 'Processing...' : plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
