'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { plans } from '@/data';
import { makePayment } from '@/services/payments';

export default function Plans() {
  const [view, setView] = useState<'oneTime' | 'monthly' | 'annually'>('oneTime');
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handlePayment = async (plan: any) => {
    const pricingOption = plan.pricing[view];

    if (view === 'oneTime') {
      const amount = pricingOption * 100;
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
    } else {
      if (pricingOption?.url) {
        window.location.href = pricingOption.url;
      } else {
        console.log('Invalid subscription link. Please try again.');
      }
    }
  };

  const proPlan = plans.find((plan) => plan.id === 'pro');
  const proPracticeFeature = proPlan ? '1 Practice' : '';

  return (
    <section className="gap-4">
      <div className="flex mx-auto border-2 border-foreground rounded overflow-hidden w-fit text-sm">
        {['oneTime', 'monthly', 'annually'].map((option) => (
          <button key={option} aria-label={`Show ${option} pricing`} className={`py-1 px-4 ${view === option ? 'bg-foreground text-background' : 'hover:bg-accent-1 hover:text-background'} focus:outline-hidden`} onClick={() => setView(option as 'oneTime' | 'monthly' | 'annually')}>
            {option === 'oneTime' ? 'One-time' : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full text-sm md:text-md">
        {plans.map((plan) => (
          <div className="p-2 md:p-4 w-full h-96" key={plan.id}>
            <div className={`h-full p-4 rounded border-2 ${plan.id === 'premium' ? 'border-accent-1' : 'border-foreground'} flex flex-col relative overflow-hidden`}>
              {plan.id === 'premium' && <span className="bg-accent-1 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>}
              <h2 className="text-xs tracking-widest title-font mb-1 uppercase">{plan.name}</h2>
              <h1 className="text-4xl pb-4 mb-4 border-b border-foreground leading-none">
                {view === 'oneTime' ? (plan.pricing.oneTime === 0 ? 'Free' : `₦ ${new Intl.NumberFormat('en-NG').format(plan.pricing.oneTime)}`) : typeof plan.pricing[view] === 'object' && 'amount' in plan.pricing[view] ? `₦ ${new Intl.NumberFormat('en-NG').format(plan.pricing[view].amount)}` : 'Free'}
                <span className="text-lg ml-1 font-normal">{view === 'monthly' ? '/mo' : view === 'annually' ? '/yr' : ''}</span>
              </h1>
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
                  <span className={view === 'oneTime' ? 'hidden' : ''}>&nbsp;per day</span>
                </p>
              )}
              <button onClick={() => handlePayment(plan)} disabled={processing[plan.id] || plan.id == 'enterprise'} className="flex items-center mt-auto bg-foreground text-background border-0 py-2 px-4 w-full focus:outline-hidden rounded">
                {processing[plan.id] ? 'Processing...' : plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
