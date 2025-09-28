'use client';

import { Background, Footer, Hero, Nav, Plan, Pricing, Stake, Values } from '@/components/landing';

export default function LandingPage() {
  return (
    <>
      <Background />
      <header>
        <Nav />
        <Hero />
      </header>
      <main className='flex flex-col gap-20'>
        <Stake />
        <Values />
        <Plan />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
