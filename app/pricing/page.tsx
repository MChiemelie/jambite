'use client';

import { useState } from 'react';

import Nav from '@/layout/Nav';

const pricingData = [
  {
    type: 'START',
    price: {
      monthly: 0,
      annually: 0,
    },
    features: ['2 Subjects', '10 Sessions', '20 Questions Per Session', 'One Profile Allowed'],
    buttonText: 'Enjoy!',
  },
  {
    type: 'PRO',
    price: {
      monthly: 1000,
      annually: (1000 - (1000 * 15) / 100) * 12,
    },
    features: ['English plus 3 Subjects of Your Choice', '200 sessions', '40 Questions Per Session', 'One Profile', 'Daily Notifications'],
    buttonText: 'Pay Now!',
  },
  {
    type: 'BUSINESS',
    price: {
      monthly: 10000,
      annually: (10000 - (10000 * 15) / 100) * 12,
    },
    features: ['Access all Subjects', 'Unlimited sessions', '40 Questions Per Session', 'Multiple Profiles', '24/7 Email Support'],
    buttonText: 'Pay Now!',
  },
  {
    type: 'SPECIAL',
    price: {
      monthly: 20000,
      annually: (20000 - (20000 * 15) / 100) * 12,
    },
    features: ['Access all Subjects', 'Unlimited Sessions', 'Multiple Profiles', 'ChatGPT Experience - Answer Review with AI', '24/7 Email Support and Customer Care'],
    buttonText: 'Pay Now!',
  },
];

export default function Pricing() {
  const [isAnnually, setIsAnnually] = useState(false);

  const toggleAnnually = () => {
    setIsAnnually(!isAnnually);
  };

  const getPrice = (pricingItem) => {
    return isAnnually ? pricingItem.price.annually : pricingItem.price.monthly;
  };

  return (
    <section className="body-font overflow-hidden">
      <Nav />
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <div className="flex mx-auto border-2 border-accent-2 rounded overflow-hidden mt-6">
            <button aria-label="Monthly based Payments" className="py-1 px-4 bg-accent-2 text-white focus:outline-none">
              Monthly
            </button>
            <button aria-label="Annaully based Payments" className="py-1 px-4" onClick={toggleAnnually}>
              Annually
            </button>
          </div>
        </div>
        <div className="flex flex-wrap -m-4">
          <div className="flex flex-wrap -m-4">
            {pricingData.map((pricingItem, index) => (
              <div className={`p-4 lg:w-1/4 md:w-1/2 w-4/5 mx-auto ${index === 1 ? 'xl:w-1/4' : ''}`} key={pricingItem.type}>
                <div className={`h-full p-6 rounded-lg border-2 ${index === 1 ? 'border-accent-1' : 'border-accent-2'} flex flex-col relative overflow-hidden`}>
                  {index === 1 && <span className="bg-accent-1 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>}
                  <h2 className="text-sm tracking-widest title-font mb-1 font-medium">{pricingItem.type}</h2>
                  <h1 className="text-5xl pb-4 mb-4 border-b border-accent-2 leading-none">
                    {pricingItem.price.monthly === 0 ? 'Free' : `₦ ${getPrice(pricingItem)}`}
                    {pricingItem.price.monthly !== 0 && <span className="text-lg ml-1 font-normal">{isAnnually ? '/an' : '/mo'}</span>}
                  </h1>
                  {pricingItem.features.map((feature) => (
                    <p className="flex items-center mb-2" key={feature}>
                      <span className="w-4 h-4 mr-2 inline-flex items-center justify-center ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg text-accent-1 rounded-full flex-shrink-0">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </span>
                      {feature}
                    </p>
                  ))}
                  <button aria-label="Monthly based Payments" className="flex items-center mt-auto bg-accent-2 text-white border-0 py-2 px-4 w-full focus:outline-none hover:rounded">
                    {pricingItem.buttonText}
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
